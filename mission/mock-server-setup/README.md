# Set Up Mock Server

## Clone the Mock Server

Clone the mock server application from [GitHub](https://github.com/SAP-samples/cloud-extension-ecc-business-process) using the branch `mock`:

```
git clone https://github.com/SAP-samples/cloud-extension-ecc-business-process -b mock
```

## Deployment

You will use the Cloud Foundry Command Line Interface (cf CLI) for the deployment. In case you have not installed it yet, follow the steps described in [GitHub](https://github.com/cloudfoundry/cli#downloads).

To deploy the application, perform the following steps:

1. Open command prompt.

2. Log in to the account and space:

```
cf login -sso
```

    Alternatively, run this command:

```
cf login
```

3. Navigate to the folder `Mock application folder` that you have cloned from the GitHub in the previous step.

### Deploy the Application Using MTA

#### Set Up the MultiApps CF CLI Plugin

> If you are using SAP Business Application Studio, skip the following steps. 

1. To build the multitarget application, you need to [download](https://sap.github.io/cloud-mta-build-tool/download/) the [Cloud MTA Build Tool (MBT)](https://sap.github.io/cloud-mta-build-tool/).

2. For Windows, install [MAKE](https://www.gnu.org/software/make/).

3. To install the [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin), run the following command: 

`cf install-plugin multiapps`

4. To install the Cloud MTA Build Tool, run the following command: 

`npm install -g mbt`


#### Build Application

To build the application, run this command: 

```
mbt build
```

#### Deploy Application

To deploy the application, run this command: 

```
cf deploy <path/to/mtar>
```

### Bind SAP Event Mesh Service Instance

If you already have Event Mesh instance, bind the same instance to the Mock server.

Run the following command from the terminal:

```
cf bs mock-srv BusinessPartnerValidation-ems && cf restart mock-srv
```

> NOTE: In the example above the name of Event Mesh service instance is BusinessPartnerValidation-ems. It can be different in your case!

### Set Up the Destination in the SAP BTP Cockpit

You need to create a destination to the newly deployed Mock Server Application.

#### Configure destination using script

> It's only relevant if you have a destination service instance created in your CF space. 

Run the following command from the terminal:

```
bash create-destination.sh bupa BusinessPartnerValidation-dest
```

> NOTE: in the command above the destination name is "bupa". You can change it as you need.
> NOTE: in the command above the destination service instance is "BusinessPartnerValidation-dest". You can change it as you need.

#### Configure destination using SAP BTP cockpit

1. Open the SAP BTP cockpit, go to your global account and navigate to your subaccount.

2. Choose **Connectivity** in the left-hand navigation, and then choose **Destinations** &rarr; **New Destination**.

3. Enter the following information for the destination in the **Destination Configuration** section and save your input:

    - Name: `bupa`
    - URL: `https://someDomain/v2/op-api-business-partner-srv`
    - Authentication: `No Authentication`

### Demo Script

1. After the successful deployment you will get the following message:

`Application "mock-srv" started and available at "..."`

2. Follow the given URL to get the CAP App Index Page. You can find `/op-api-business-partner-srv` link there. This URL can be used as OData V4 Endpoint. Use this URL in the corresponding destination for your mission.

3. If you need V2 Endpoint please add '/v2' to the endpoint URL.

```
https://someDomain/v2/op-api-business-partner-srv`
```

4. On the index page there is a link to SwaggerUI: Open API Preview. Open it.

5. Go to the POST section of /A_BusinessPartner. Click the button Try it out. Use the following JSON as a payload (replace the proposed one):

```
{  
    "BusinessPartner": "555",  
	"BusinessPartnerName": "Max Mustermann",  
	"BusinessPartnerFullName": "Max Mustermann",  
	"FirstName": "Max",  
	"LastName": "Mustermann",  
	"BusinessPartnerIsBlocked": true,  
	"to_BusinessPartnerAddress": [{  
        "BusinessPartner": "555",  
		"AddressID": "1",  
		"StreetName": "Platz der Republik",  
		"HouseNumber": "1",  
		"PostalCode": "10557",  
		"CityName": "Berlin",  
		"Country": "DE"  
	}]  
}
```

6. Click Execute. 
You should get a response with the code 201. This means that the entry was created in the database and the corresponding event was triggered (if the Event Mesh instance is binded).

7. Now, go back to the Business Partner application to see if the new Business Partner has been updated in the UI.
