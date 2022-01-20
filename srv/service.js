module.exports = async srv => {
  const {BusinessPartnerAddress, Notifications, Addresses, BusinessPartner} = srv.entities;
  const bupaSrv = await cds.connect.to("API_BUSINESS_PARTNER");
  const messaging = await cds.connect.to('messaging')
  const namespace = messaging.options.credentials && messaging.options.credentials.namespace
  const {postcodeValidator} = require('postcode-validator');
  const {BusinessPartner: sdkBusinessPartner, BusinessPartnerAddress: sdkBusinessPartnerAddress}  = require('@sap/cloud-sdk-vdm-business-partner-service');
  
  srv.on("READ", BusinessPartnerAddress, req => bupaSrv.tx(req).run(req.query))
  srv.on("READ", BusinessPartner, req => bupaSrv.tx(req).run(req.query))

  messaging.on("refappscf/ecc/123/BO/BusinessPartner/Created", async msg => {
    console.log("<< event caught", msg.event);
    let BUSINESSPARTNER = "";
    BUSINESSPARTNER = parseInt(msg.data.BUT000[0].PARTNER);
    console.log("<<< Received Created Business Partner Id " + BUSINESSPARTNER);
    let BusinessPartnerName = "";
    if(msg.data.BUT000[0].NAME1_TEXT == ""){
      BusinessPartnerName = msg.data.BUT000[0].NAME_FIRST + ' ' + msg.data.BUT000[0].NAME_LAST;
    }
    else{
      BusinessPartnerName = msg.data.BUT000[0].NAME1_TEXT;  
    }
    const result = await cds.run(INSERT.into(Notifications).entries({businessPartnerId:BUSINESSPARTNER, verificationStatus_code:'N', businessPartnerName:BusinessPartnerName}));        
    let address = {
            addressId: parseInt(msg.data.BUT000[0].ADRC[0].BUT020[0].ADDRNUMBER),
            country: msg.data.BUT000[0].ADRC[0].COUNTRY,
            cityName: msg.data.BUT000[0].ADRC[0].CITY1,
            streetName: msg.data.BUT000[0].ADRC[0].STREET,
            postalCode: msg.data.BUT000[0].ADRC[0].POST_CODE1,
            businessPartnerId: BUSINESSPARTNER
       }
      if(address) {  
       const notificationObj = await cds.run(SELECT.one(Notifications).columns("ID").where({businessPartnerId: BUSINESSPARTNER}));
       address.notifications_ID=notificationObj.ID
       const res = await cds.run(INSERT.into(Addresses).entries(address));
       console.log("Address inserted");
       }  
  });

  messaging.on("refappscf/ecc/123/BO/BusinessPartner/Changed", async msg => {

    let BUSINESSPARTNER = "";
    let fullName = "";
    BUSINESSPARTNER = parseInt(msg.data.objectId);
    BUSINESSPARTNER = (+BUSINESSPARTNER).toString()
    console.log("<<< Received Changed Business Partner Id " + BUSINESSPARTNER);    
    const bpIsAlive = await cds.tx(msg).run(SELECT.one(Notifications , (n) => n.verificationStatus_code).where({businessPartnerId: BUSINESSPARTNER}));
    const notif = await cds.run(SELECT.from(Notifications).where({businessPartnerId: BUSINESSPARTNER}))
    let name = notif[0].businessPartnerName
    var name_split = name.split(" ");
    let firstname = name_split[0];
    let lastname = name_split[1];

    if(bpIsAlive && msg.data.NAME_LAST) {
        console.log("<<< Received last name", msg.data.NAME_LAST)
        lastname = msg.data.NAME_LAST;
        fullName = firstname + " " + lastname;
        const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({businessPartnerName:fullName}));
        console.log("<< BP Last Name Updated >>")  
    }  

    if(bpIsAlive && msg.data.NAME_FIRST) {
        console.log("<<< Received first name", msg.data.NAME_FIRST)
        firstname = msg.data.NAME_FIRST;
        fullName = firstname + " " + lastname;
        const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({businessPartnerName:fullName}));
        console.log("<< BP First Name Updated >>")  
    }      


    if(bpIsAlive && msg.data.XBLCK == "") {
        bpIsAlive.verificationStatus_code = "V"
        console.log("<< BP marked Verified >>")  
    }  
     
    if(bpIsAlive && msg.data.XBLCK == "X") {
        const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"P"}));
        console.log("<< BP marked Processed >>")  
    }   

    if(bpIsAlive && bpIsAlive.verificationStatus_code == "V") {
        const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"C"}));
        console.log("<< BP marked Completed >>")  
    }    
  });

  srv.after("UPDATE", "Notifications", (data, req) => {
    console.log("Notification update", data.businessPartnerId);
    if(data.verificationStatus_code === "V" || data.verificationStatus_code === "INV")
    emitEvent(data, req);
  });

  srv.before("SAVE", "Notifications", req => {
    if(req.data.verificationStatus_code == "C"){
      req.error({code: '400', message: "Cannot mark as COMPLETED. Please change to VERIFIED", numericSeverity:2, target: 'verificationStatus_code'});
    }
  });

  srv.before("PATCH", "Addresses", req => {
    // To set whether address is Edited
    req.data.isModified = true;
  });

  srv.after("PATCH", "Addresses", (data, req) => {
    const isValidPinCode = postcodeValidator(data.postalCode, data.country);
    if(!isValidPinCode){
      return req.error({code: '400', message: "invalid postal code", numericSeverity:2, target: 'postalCode'});
    } 
    return req.info({numericSeverity:1, target: 'postalCode'});  
  });

  async function emitEvent(result, req){
    const resultJoin =  await cds.tx(req).run(SELECT.one("my.businessPartnerValidation.Notifications as N").leftJoin("my.businessPartnerValidation.Addresses as A").on("N.businessPartnerId = A.businessPartnerId").where({"N.ID": result.ID}));
    const statusValues={"N":"NEW", "P":"PROCESS", "INV":"INVALID", "V":"VERIFIED"}

    if(resultJoin.isModified){
      let payload = {
        streetName: resultJoin.streetName,
        postalCode: resultJoin.postalCode
      }
      let payloadBuilder = sdkBusinessPartnerAddress.builder().fromJson(payload);
      payloadBuilder.businessPartner = resultJoin.businessPartnerId;
      payloadBuilder.addressId = resultJoin.addressId

      let res = await sdkBusinessPartnerAddress.requestBuilder().update(payloadBuilder).withCustomServicePath("/").execute({
        destinationName: bupaSrv.destination
      });
      console.log("address update to S4", res);
    }

    let payload = {
      "searchTerm1": statusValues[resultJoin.verificationStatus_code],
      "businessPartnerIsBlocked": (resultJoin.verificationStatus_code == "V")?false:true
    }
    let payloadBuilder = sdkBusinessPartner.builder().fromJson(payload);
    payloadBuilder.businessPartner = resultJoin.businessPartnerId;
    let res = await sdkBusinessPartner.requestBuilder().update(payloadBuilder).withCustomServicePath("/").execute({
      destinationName: bupaSrv.destination
    });
    console.log("Search Term update", res);
  } 
}