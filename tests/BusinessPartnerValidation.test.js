const cds = require('@sap/cds');

describe('BusinessPartnerValidation: Odata Protocol level testing', () => {
    const app = require('express')();
    const request = require('supertest')(app);

    beforeAll(async ()=> {
        await cds.deploy(__dirname + '../srv/service').to('sqlite: :memory:');
        await cds.serve('Sales').from(__dirname + '../srv/service').in(app);
    });

    it('Service $metadata document', async () => {
        const response = await request
            .get('/sales/$metadata')
            .expect('Content-Type', /^application\/xml/)
            .expect(200)
    });
});

describe('BusinessPartnerValidation: CDS service level Testing', () => {
    let srv, Notification;
    beforeAll(async () => {
        srv = await cds.serve('Sales').from(__dirname + '../srv/service');
        Notification = srv.entities.Notification;
        expect(Notification).toBeDefined();
    });
});