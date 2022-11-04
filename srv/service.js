module.exports = async srv => {
  const {BusinessPartnerAddress, Notifications, Addresses, BusinessPartner} = srv.entities;
  const bupaSrv = await cds.connect.to("API_BUSINESS_PARTNER");
  const messaging = await cds.connect.to('messaging')
  const namespace = messaging.options.credentials && messaging.options.credentials.namespace
  const {postcodeValidator} = require('postcode-validator');
  const log = cds.log("sales-service");
  
  srv.on("READ", BusinessPartnerAddress, req => bupaSrv.run(req.query))
  srv.on("READ", BusinessPartner, req => bupaSrv.run(req.query))

  messaging.on(["refappscf/ecc/123/BO/BusinessPartner/Created","refappscf/ecc/123/ce/BO/BusinessPartner/Created"], async msg => {
    log.info("<< Create event caught", msg.data);
    let BUSINESSPARTNER = "";
    BUSINESSPARTNER = msg.data.BUT000[0].PARTNER;
    let BusinessPartnerName = msg.data.BUT000[0].NAME1_TEXT == "" ? msg.data.BUT000[0].NAME_FIRST + ' ' + msg.data.BUT000[0].NAME_LAST : msg.data.BUT000[0].NAME1_TEXT;
    const result = await cds.run(INSERT.into(Notifications).entries({businessPartnerId:BUSINESSPARTNER, verificationStatus_code:'N', businessPartnerName:BusinessPartnerName}));        
    let adrc = msg.data.BUT000[0]?.ADRC[0];
    console.log("<<adrc",adrc)
    let address = {
            addressId: parseInt(adrc?.BUT020[0].ADDRNUMBER),
            country: adrc?.COUNTRY,
            cityName: adrc?.CITY1,
            streetName: adrc?.STREET,
            postalCode: adrc?.POST_CODE1,
            businessPartnerId: BUSINESSPARTNER
       }
      if(address) {  
       const notificationObj = await cds.run(SELECT.one(Notifications).columns("ID").where({businessPartnerId: BUSINESSPARTNER}));
       address.notifications_ID=notificationObj.ID
       const res = await cds.run(INSERT.into(Addresses).entries(address));
       log.info("Address inserted");
       }  
  });

  messaging.on(["refappscf/ecc/123/BO/BusinessPartner/Changed","refappscf/ecc/123/ce/BO/BusinessPartner/Changed"], async msg => {
    let BUSINESSPARTNER = "";
    BUSINESSPARTNER = msg.data.objectId;
    log.info("<<< Received Changed Business Partner Id " + BUSINESSPARTNER);    
    const bpIsAlive = await cds.run(SELECT.one(Notifications , (n) => n.verificationStatus_code).where({businessPartnerId: BUSINESSPARTNER}));
    if(bpIsAlive) {
        const notif = await cds.run(SELECT.from(Notifications).where({businessPartnerId: BUSINESSPARTNER}))
        let name = notif[0].businessPartnerName
        var name_split = name.split(" ");
        let firstname = name_split[0];        
        let lastname = name_split[1];

    if (msg.data.NAME_FIRST || msg.data.NAME_LAST) {
      let fullName = msg.data.NAME_LAST ? (msg.data.NAME_FIRST ? (msg.data.NAME_FIRST + ' ' + msg.data.NAME_LAST) : (firstname + ' ' + msg.data.NAME_LAST)) : (msg.data.NAME_FIRST + ' ' + lastname);
      log.info("<<<full name",fullName)
      const bpMarkVerified = await cds.run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({businessPartnerName:fullName}));
     }

    if(msg.data.XBLCK == "") {
        bpIsAlive.verificationStatus_code = "V"
        log.info("<< BP marked Verified >>")  
    }  
     
    if(msg.data.XBLCK == "X") {
        const bpMarkVerified= await cds.run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"P"}));
        log.info("<< BP marked Processed >>")  
    }   

    if(bpIsAlive.verificationStatus_code == "V") {
        const bpMarkVerified= await cds.run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"C"}));
        log.info("<< BP marked Completed >>")  
    } 
   }     
  });

  srv.after("UPDATE", "Notifications", (data, req) => {
    log.info("Notification update", data.businessPartnerId);
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
    const resultJoin =  await cds.run(SELECT.one("my.businessPartnerValidation.Notifications as N").leftJoin("my.businessPartnerValidation.Addresses as A").on("N.businessPartnerId = A.businessPartnerId").where({"N.ID": result.ID}));
    const statusValues={"N":"NEW", "P":"PROCESS", "INV":"INVALID", "V":"VERIFIED"}

    if(resultJoin.isModified){
      let payload = {
        streetName: resultJoin.streetName,
        postalCode: resultJoin.postalCode
      }
      let res = await bupaSrv.run(UPDATE(BusinessPartnerAddress).set(payload).where({businessPartnerId:resultJoin.businessPartnerId, addressId:resultJoin.addressId}));
      log.info("address update to S4", res);
    }

    let payload = {
      "searchTerm1": statusValues[resultJoin.verificationStatus_code],
      "businessPartnerIsBlocked": (resultJoin.verificationStatus_code == "V")?false:true
    }
    let res =  await bupaSrv.run(UPDATE(BusinessPartner, resultJoin.businessPartnerId).with(payload)); 
    log.info("Search Term update", res);
  } 
}