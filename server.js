const cds = require ('@sap/cds')
const proxy = require("@sap/cds-odata-v2-adapter-proxy");

module.exports = cds.server

const cds_swagger = require ('cds-swagger-ui-express')
cds.on ('bootstrap', app => app.use (cds_swagger()) )

cds.on("bootstrap", app => app.use(proxy()) );