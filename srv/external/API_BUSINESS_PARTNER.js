const cds = global.cds || require('@sap/cds')
module.exports = async srv => {
    const messaging = await cds.connect.to('messaging')
    // Mock events for s4
    srv.after("CREATE", async data => {
        const payload = {event: "CREATED", objectId: JSON.stringify(data.BusinessPartner)};
        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Created", payload);
        console.log('<< event emitted', payload);
    });

    srv.on("UPDATE", async data => {
        const payload = {event: "CHANGED", objectId: JSON.stringify(req.data.BusinessPartner)};
        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Changed", payload);
        console.log('<< event emitted', payload);
    });
}