const cds = global.cds || require('@sap/cds')
module.exports = async srv => {
    const messaging = await cds.connect.to('messaging')
    // Mock events for s4
    srv.after("CREATE", async data => {
        const payload = {event: "CREATED", objectId: data.BusinessPartner};
        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Created", JSON.stringify(payload));
        console.log('<< event emitted', payload);
    });

    srv.after("UPDATE", async data => {
        const payload = {event: "CHANGED", objectId: data.BusinessPartner};
        messaging.emit("refappscf/ecc/123/BO/BusinessPartner/Changed", JSON.stringify(payload));
        console.log('<< event emitted', payload);
    });
}
