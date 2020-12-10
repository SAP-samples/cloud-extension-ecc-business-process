
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
    console.log("<< event caught", msg);
    const data = JSON.parse(msg.data);
    const BUSINESSPARTNER = data.objectId;
    console.log(BUSINESSPARTNER);
    if(data.event === "CREATED"){
      const bpEntity = await bupaSrv.tx(msg).run(SELECT.one(BusinessPartner).where({businessPartnerId: BUSINESSPARTNER}));
      console.log("bpEntityyy", bpEntity);
      const result = await cds.tx(msg).run(INSERT.into(Notifications).entries({businessPartnerId:bpEntity.businessPartnerId, verificationStatus_code:'N', businessPartnerName:bpEntity.businessPartnerName}));
      const address = await bupaSrv.tx(msg).run(SELECT.one(BusinessPartnerAddress).where({businessPartnerId: bpEntity.businessPartnerId}));
      // for the address to notification association - extra field
      const notificationObj = await cds.tx(msg).run(SELECT.one(Notifications).columns("ID").where({businessPartnerId: bpEntity.businessPartnerId}));
      address.notifications_id=notificationObj.ID;
      const res = await cds.tx(msg).run(INSERT.into(Addresses).entries(address));
      console.log("Address inserted", result);
    }
  });


  messaging.on("refappscf/ecc/123/BO/BusinessPartner/Changed", async msg => {
    console.log("<< event caught", msg);
    const data = JSON.parse(msg.data);
    const BUSINESSPARTNER = (+data.objectId).toString();
    if(data.event === "CHANGED"){
      const bpIsAlive = await cds.tx(msg).run(SELECT.one(Notifications, (n) => n.verificationStatus_code).where({businessPartnerId: BUSINESSPARTNER}));
      if(bpIsAlive && bpIsAlive.verificationStatus_code == "V"){
        const bpMarkVerified= await cds.tx(msg).run(UPDATE(Notifications).where({businessPartnerId: BUSINESSPARTNER}).set({verificationStatus_code:"C"}));
      }    
      console.log("<< BP marked verified >>")
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
        destinationName: 'bupa-ecc'
      });
      console.log("address update to ECC", res);
    }

    let payload = {
      "searchTerm1": statusValues[resultJoin.verificationStatus_code],
      "businessPartnerIsBlocked": (resultJoin.verificationStatus_code == "V")?false:true
    }
    let payloadBuilder = sdkBusinessPartner.builder().fromJson(payload);
    payloadBuilder.businessPartner = resultJoin.businessPartnerId;
    let res = await sdkBusinessPartner.requestBuilder().update(payloadBuilder).withCustomServicePath("/").execute({
      destinationName: 'bupa-ecc'
    });
    console.log("Search Term update", res);
  }

  
}
