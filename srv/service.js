module.exports = async srv => {
  const {BusinessPartnerAddress, Notifications, Addresses, BusinessPartner} = srv.entities;
  const bupaSrv = await cds.connect.to("API_BUSINESS_PARTNER");
  const messaging = await cds.connect.to('messaging')
  const namespace = messaging.options.credentials && messaging.options.credentials.namespace
  const {postcodeValidator} = require('postcode-validator');

  srv.on("READ", BusinessPartnerAddress, req => bupaSrv.run(req.query))
  srv.on("READ", BusinessPartner, req => bupaSrv.run(req.query))

  messaging.on(["refappscf/ecc/123/BO/BusinessPartner/Created","refappscf/ecc/123/ce/BO/BusinessPartner/Created"], async msg => {
    console.log("<< event caught", msg.event);
    let BUSINESSPARTNER = "";
    if(msg.headers && msg.headers.type == "sap.nw.ee.BusinessPartner.Created.v1"){
       //> SP3 version
      BUSINESSPARTNER = msg.data.BusinessPartner;
    }
    else{
      //> SP1 version
      BUSINESSPARTNER = JSON.parse(msg.data).objectId;  
    }
    console.log("<<< Received Created Business Partner Id" + BUSINESSPARTNER);
      const bpEntity = await bupaSrv.run(SELECT.one(BusinessPartner).where({businessPartnerId: BUSINESSPARTNER}));
      if(!bpEntity){
        log.info(`BP doesn't exist in the given destination`);
        return;
      }
      const result = await cds.run(INSERT.into(Notifications).entries({businessPartnerId:bpEntity.businessPartnerId, verificationStatus_code:'N', businessPartnerName:bpEntity.businessPartnerName}));     
      const address = await bupaSrv.run(SELECT.one(BusinessPartnerAddress).where({businessPartnerId: bpEntity.businessPartnerId}));
      // for the address to notification association - extra field
      if(address) {  
      const notificationObj = await cds.run(SELECT.one(Notifications).columns("ID").where({businessPartnerId: bpEntity.businessPartnerId}));
      address.notifications_ID=notificationObj.ID;
      const res = await cds.run(INSERT.into(Addresses).entries(address));
      console.log("Address inserted");
      }  
  });

  messaging.on(["refappscf/ecc/123/BO/BusinessPartner/Changed","refappscf/ecc/123/ce/BO/BusinessPartner/Changed"], async msg => {
    let BUSINESSPARTNER = "";
    if(msg.headers && msg.headers.type == "sap.nw.ee.BusinessPartner.Changed.v1"){
       //> SP3 version
      BUSINESSPARTNER = msg.data.BusinessPartner;
    }
    else{
      //> SP1 version
      BUSINESSPARTNER = JSON.parse(msg.data).objectId;  
    }
    BUSINESSPARTNER = (+BUSINESSPARTNER).toString()
    console.log("<<< Received Changed Business Partner Id" + BUSINESSPARTNER);
      const bpIsAlive = await cds.run(SELECT.one(Notifications, (n) => n.verificationStatus_code).where({businessPartnerId: BUSINESSPARTNER}));
      if(bpIsAlive && bpIsAlive.verificationStatus_code == "V"){
        const bpMarkVerified= await cds.run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"C"}));
    } 
    console.log("<< BP marked verified >>")     
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
    const resultJoin =  await cds.run(SELECT.one("my.businessPartnerValidation.Notifications as N").leftJoin("my.businessPartnerValidation.Addresses as A").on("N.businessPartnerId = A.businessPartnerId").where({"N.ID": result.ID}));
    const statusValues={"N":"NEW", "P":"PROCESS", "INV":"INVALID", "V":"VERIFIED"}

    if(resultJoin.isModified){
      let payload = {
        streetName: resultJoin.streetName,
        postalCode: resultJoin.postalCode
      }
      console.log("<<<<payload address", payload)
      let res = await bupaSrv.run(UPDATE(BusinessPartnerAddress).set(payload).where({businessPartnerId:resultJoin.businessPartnerId, addressId:resultJoin.addressId}));
      //let res =  await bupaSrv.run(UPDATE(BusinessPartnerAddress, resultJoin.businessPartnerId ).with(payload)); 
      console.log("address update to ECC", res);
    }

    let payload = {
      "searchTerm1": statusValues[resultJoin.verificationStatus_code],
      "businessPartnerIsBlocked": (resultJoin.verificationStatus_code == "V")?false:true
    }
     let res =  await bupaSrv.run(UPDATE(BusinessPartner, resultJoin.businessPartnerId).with(payload)); 
    console.log("Search Term update", res);
  } 
}
