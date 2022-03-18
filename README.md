# MOCKrele

This is a Mock Server for OData API's (e.g. from S/4HANA, ECC etc.).

This is a project fork from [this repo](https://github.tools.sap/refapps/s4hana-cloud-mock). This project implies to work as SAP S/4HANA Cloud Mock backend server for the Reference Applications use cases. The project is built on Cloud Application Programming (CAP) model with mocking capabilities.

General features:
- OData Endpoints for both versions - [V2](https://cap.cloud.sap/docs/advanced/odata#v2-support) and V4
- CSV files for [mock data](https://cap.cloud.sap/docs/guides/using-services#local-mocking)
- [Event emitting](https://cap.cloud.sap/docs/guides/messaging/#using-sap-event-mesh) on [data change](https://cap.cloud.sap/docs/guides/providing-services#registering-event-handlers)
- Enhancement possibilities (adding new services)
- In-memory [SQLite DB](https://cap.cloud.sap/docs/guides/databases#deploy-to-sqlite) is used (no DB instance is needed)

New features added:
- [SwaggerUI](https://cap.cloud.sap/docs/advanced/openapi#swagger-ui)
- Emitting events compliant with the following Discover Center missions:
    - [S/4HANA Extension](https://discovery-center.cloud.sap/protected/index.html#/missiondetail/3730/3769/)
    - [ECC Extension](https://discovery-center.cloud.sap/protected/index.html#/missiondetail/3338/3384/)
- Hybrid Event Mesh [test](https://cap.cloud.sap/docs/advanced/hybrid-testing)
- [MTA Deployment](https://cap.cloud.sap/docs/guides/deployment/)
    - Event Mesh instance binding
    - Change destination content

## Quick start

ToDo

## Hybrid test

ToDo

## Project Structure

It contains these folders and files, following our recommended project layout:

File or Folder | Purpose
---------|----------
`app/` | content for UI frontends goes here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`package.json` | project metadata and configuration
`readme.md` | this getting started guide


- Open a new terminal and run `cds watch` 
- (in VS Code simply choose _**Terminal** > Run Task > cds watch_)
- Start adding content, for example, a [db/schema.cds](db/schema.cds).

## Adding own services

