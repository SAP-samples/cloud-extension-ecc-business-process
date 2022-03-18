# MOCKrele

This is a Mock Server for OData API's (from S/4HANA, ECC etc.).

This is a project fork from [this repo](https://github.tools.sap/refapps/s4hana-cloud-mock).

New features added:
- SwaggerUI
- Events emitting for the following SAP missions:
    - S/4HANA Extension
    - ECC Extension
- Hybrid Event Mesh test
- MTA Deployment
    - Event Mesh instance binding
    - Change destination content

## Quick start


## Hybrid test

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


