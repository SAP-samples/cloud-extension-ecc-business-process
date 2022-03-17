const cds = global.cds || require('@sap/cds')
module.exports = async srv => {
    
    const messaging = await cds.connect.to('messaging')

    // Mock events for s4
    srv.after("CREATE", "A_BusinessPartner", data => {
        var payload = {
            "BUT000": [{
                "PARTNER": data.BusinessPartner,
                "NAME_FIRST": data.FirstName,
                "NAME_LAST": data.LastName,
                "NAME1_TEXT": data.BusinessPartnerName
            }]
        };

        if (data.to_BusinessPartnerAddress && data.to_BusinessPartnerAddress[0]){
            var BPAddress = data.to_BusinessPartnerAddress[0];
            payload.BUT000[0].ADRC = [{
                "CITY1": BPAddress.CityName,
                "POST_CODE1": BPAddress.PostalCode,
                "STREET": BPAddress.StreetName,
                "COUNTRY": BPAddress.Country,
                "BUT020": [{ "ADDRNUMBER": BPAddress.AddressID }]
            }]
        };

        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Created", payload);
    });

    srv.after("UPDATE", "A_BusinessPartner", data => {
        const payload = {
            "objectType": "BUS1006",
            "event": "CHANGED",
            "XBLCK": data.BusinessPartnerIsBlocked ? "X" : "",
            "BU_SORT1": data.SearchTerm1,
            "objectId": data.BusinessPartner
        };

        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Changed", payload);
    });
}