# Setup the SAP Cloud Application Programming Model Application

## Introduction

In this section we will configure our reference application, create the necessary service instances for the SAP HANA DB, Event Mesh, security and connectivity. Deploy the application to your SAP BTP account and run a first test.

**Abbreviation:** SAP Business Technology Platform = SAP BTP
 
The application structure is based on the SAP Cloud Application Programming Model (CAP)
 If you want to know how to build such an application from scratch please check the [CAP Documentation](https://cap.cloud.sap/docs/) or take a look at [Mission: Extend SAP S/4HANA On Premise business processes on SAP BTP](https://platformx-ad17b8dc3.dispatcher.hana.ondemand.com/protected/index.html#/missiondetail/3242/3268) where the local development part is shown.

The SAP Cloud Application project contains below folders and files:

File / Folder | Purpose
---------|----------
`app/` | content for the UI frontend (Fiori Elements) go here 
`db/` | your domain cds models and data go here
`srv/` | your service models and code go here
`srv/external` | the reference to the external Business Partner service
`srv/external/data` | some sample data for the demo app
`srv/service.js` | the implementation of the service model 
`package.json` | project metadata and configuration
`em.json` | the configuration file for the Event Mesh service
`xs-security.json` | the configuration file for the xsuaa service
`mta.yaml` | the multi target application build file


**Persona:** Cloud Application Developer

## Step-by-step
### Create a new application in SAP Business Application Studio

1.	Make sure you have opened your *SAP BTP Account* and navigate to your *Subaccount* 
   
2.	Select *Instances and Subscriptions*. In the Subscriptions section select **Business Application Studio**. Select **Go to Application**.

    ![Open Business Application Studio](./images/dev-cap-app-1.png)
   
3.	Open the application 'Business Application Studio' and login via your username and password

     ![Log in Business Application Studio](./images/dev-cap-app-2.png)
 
4.	In Business Application Studio click the button *Create Dev Space*

     ![Create Dev Space](./images/dev-cap-app-3.png)
 
5.	On the next screen enter a Dev space name e.g **mission**, select the type **Full Stack Cloud Application**. Choose **Create Dev Space**

      ![Configure Dev Space](./images/dev-cap-app-4.png)
      
 
6.	Your Dev Space is now being created. As soon as the Dev Space is available you can choose your Dev Spaces name to access it.

7.	Choose **Terminal -> New Terminal** in the menu on the top of your screen.

    ![Open Terminal](./images/dev-cap-app-5.png)
 
8. Go to projects Folder
   
   ```bash 
   cd projects
   ``` 
 
9.	Clone the project from the SAP samples application repository 

    ```bash
    git clone https://github.com/SAP-samples/cloud-extension-ecc-business-process.git 
     ```
 
10.	Choose **File** in the menu on the top and then choose **Open Workspace** in the drop down.

    ![Open Workspace](./images/dev-cap-app-7.png)
 
11.	 Open the project by selecting projects -> cloud-extension-ecc-business-process and choose **Open**
 

12.  Next you need to login to your SAP BTP account:
 
   * Check if you are logged in to your BTP Account from **SAP Business Application Studio***
     
   * To login to Cloud Foundry, In the tabs, click on View-> Select **Find Command**.
    
   * Search for **CF Login**.
    
   * Select for **CF: Login on to Cloud Foundry**.

     ![Login to CF](./images/loginToCF.png) 
    
   * Enter CF API endpoint or take the default suggested API endpoint. You can find the API endpoint of your region by switching into your SAP BTP account browser window and copy the API Endpoint. Also write down the **Org Name** into a text editor of your choice which is needed for the next step.  

     ![copy Cloud Data](./images/copyCloudData.png)
    
   * Choose **Spaces** and write down the space name to a text editor of your choice. 

     ![copy Space Name](./images/copySpaceName.png)
     
   * Enter **Email** and **Password** when prompted.
   * Select your Cloud Foundry **Org** which you have noted down in step before 
   * Select the space name which you have noted down. Once you have selected the Org and Space, you would login to your Cloud Foundry account from SAP Business Application Studio.


13. For the next steps you need the terminal again. Go to **Terminal** -> **New Terminal**
    - First we create a hdi-shared database instance, therefore we need the guid of the SAP HANA Cloud service that we have created at the [SAP BTP Setup](../scp-setup/README.md). You can find the service name in the list of services
      
	 ```bash
		 cf services    
		    
		 cf service <HANA-Service> --guid
    ```

    With the guid we can create a hdi-shared database instance:
       
    ```bash
       cf cs hana hdi-shared BusinessPartnerValidation-db -c '{"database_id" : "<guid of HANA Service>"}'
    ```   
            
   
    - In a next step, you will create a number of services e.g. for connection and Event Mesh. You will do this by executing the following Cloud Foundry create service commands.
    

   
      * Create enterprise-messaging instance using the em.json configuration file in your project.
     
        ```bash
         cf cs enterprise-messaging default BusinessPartnerValidation-ems -c em.json
        ```
        
        > When you are using **SAP BTP trial** then you have to use the dev service plan. The em.json file should have below parameters to work with Event Mesh (dev plan). Change "\<emname\> to a meaningful value e.g. eccevent
        >   ```json
        >   { "emname": "<emname>",
        >     "options": {
        >       "management": true,
        >       "messagingrest": true,
        >       "messaging": true
        >   }
        > }
        > ```
        >
        >```bash
        >   cf cs enterprise-messaging dev BusinessPartnerValidation-ems -c em.json
        
        > **SAP BTP Trial only:** Open srv>service.js file and search for messaging.on and replace the topic name (refappscf/ecc/123/BO/BusinessPartner/Changed) with the customized one.
        > Ex:- \<emname\>/BO/BusinessPartner/Created and \<emname\>/BO/BusinessPartner/Changed
        
        > **SAP BTP Trial only:** In the mta.yml file change the service plan name to dev for BusinessPartnerValidation-ems
        >```
        >  - name: BusinessPartnerValidation-ems
        >    parameters:
        >    path: ./em.json 
        >    service: enterprise-messaging
        >    service-plan: default
        > type: org.cloudfoundry.managed-service 
        > ```

      * Create a destination instance
  
        ```bash
        cf cs destination lite BusinessPartnerValidation-dest
        ```

      * Create a xsuaa instance using the xs-security.json configuration file in your project.
    
        ```bash
        cf cs xsuaa application BusinessPartnerValidation-xsuaa -c xs-security.json
        ```    

      * Create a connectivity instance for accessing SAP Cloud Connector.  
 
        ```bash
        cf cs connectivity lite BusinessPartnerValidation-cs        
        ```

      * Generate a service key we will this later for binding services 
   
        ```bash
         cf create-service-key BusinessPartnerValidation-ems emkey
        ```

      * Build the application  
    
        ```bash
        cds build --production
        ```


    
14.	Open the gen/srv/manifest.yaml file and add your service names / replace existing ones with your services: ems, dest, xsuaa, database.  
Set the Memory as 256MB.

   > Hint: to make sure that the services names match, execute the CF command **cf services** which lists the services you have created including their names.

   ![Edit manifest](./images/dev-cap-app-12.png)
 

1.  Go back to the terminal and run following commands:

    ```bash
    
       //generate the database instance deploy the database content
       cf p -f gen/db
       
       //generate the service instances and deploy the service
       cf p -f gen/srv --random-route
    ```
 
2. Generate the mtar file
    
    ```bash
      mbt build -p=cf
    ```

3.  Deploy the UI and service to your Cloud Foundry space with the mtar.
    
    ```bash
    cf deploy mta_archives/BusinessPartnerValidation_1.0.0.mtar
    ```

### Test your application

1. Go to the terminal and enter *cf apps*.

 ![Run command](./images/dev-cap-app-18.png)

2. Copy the BusinessPartnerValidation-ui url.

3. Open a new browser tab and paste the URL in there.

 ![Open App](./images/test-app-1.png)

4. Copy the BusinessPartnerValidation-srv url and open it in a new browser tab.

 ![Open App](./images/dev-cap-app-19.png)

 ## Summary

 We have done the configuration for the reference application. We created the instances for the required services and deployed the application to our SAP BTP space. In the next steps we configure the eventing on cloud and on-premise and then we are ready to run the application.



