# Configuration of Eventing in On-Premise Backend and SAP Event Mesh

## Introduction

In this section, you will learn how to configure your on-premise backend system to use the SAP NetWeaver Add-On for Event Enablement Service Pack SP03. If you have installed only Service Pack SP01 or SP02, please use the [SP01 Setup Guide](./SETUP_SP01.md). In SP03, the setup has been simplified and the events are now compatible to standard SAP S/4HANA events.

**Audience:** Basis ABAP Administrator 

## Step-by-Step

### Prerequisites

- A working instance of SAP Event Mesh.

### Download SAP Event Mesh Certificate 

1. Log in to the SAP BTP cockpit.
2. Navigate to your subaccount, and then choose **Services** > **Service Instances**.
3. Select your already created SAP Event Mesh service instance and view the Service Key. Copy this Service Key to a text editor of your choice.
   
   ![Open EM Servicekey](./images/ems-1.png)
   
4. Copy the SAP Event Mesh Token Endpoint URL and open this URL in a browser of your choice. Here, the following screenshots are done with Internet Explorer and might differ for other browsers.
   
   ![copy EM Token Endpoint](./images/copyEMTokenEndpoint.png)
   
5. Once you open the Token Endpoint URL, choose **Cancel** in the popup and select on view site information button (lock symbol on top left corner), then choose **Certificate**.

   ![download Certificate1](./images/downloadCertificate1.png)
   
6. Select **Details** and choose **Copy to files**.

   ![download Certificate2](./images/downloadCertificate2.png)
   
7. When the **Certificate Export Wizard** opens, choose **Next**.

   ![download Certificate3](./images/downloadCertificate3.png)
   
8. Select the format as **DER encoded binary X.509 (.CER)** and choose **Next**.

    ![download Certificate4](./images/downloadCertificate4.png)
    
9. Select a folder to export the certificate and choose **Next**.
   
   ![download Certificate5](./images/downloadCertificate5.png)
   
10. Select **Finish** to export the certificate. You have exported the SAP Event Mesh certificate.

    ![download Certificate6](./images/downloadCertificate6.png)
    
	
### Create a Node for Standard SSL Client
1. Open your SAP backend system and go to transcaction - **/nSTRUST**. 
2. Select **Display/Change icon** and right-click on **SSL client SSL Client (Standard) Node** and choose **Create**.

   ![Standard-1](./images/Standard-1.png)

3. A popup **Create PSE** appears. Choose **Continue(Enter)**.

   ![Standard-2](./images/Standard-2.png)
 
 
 
### Import SAP Event Mesh Certificate in Your On-Premise System


1. Still in transaction - **/nSTRUST**. 	
2. Select **Display/Change icon** and right-click on **SSL client SSL Client (Anonymous)  Node**, then select **Create**.

   ![download Certificate5](./images/openStrust.png)
   
3. A Popup **Create PSE** appears. Choose **Continue(Enter)**.

   ![Anonymous-2](./images/Anonymous-2.png)
   
4. Choose **Import Certificate** (under **Certificate**).

    ![import certificate1](./images/importcertificate1.png)

5. Enter file path to certificate file which you have stored in your local system.
   
   ![import certificate2](./images/importCertificate2.png)
   
6. Choose **Continue** and then **Allow** for the **SAP GUI Security** popup asking to allow access to the file. 
7. Once you can see the certificate as imported, choose **Add to Certificate List** and choose the **Save** icon.
   
   >Hint: Note the valid-to date of the certificate and update it in advance.	
   
   ![add To Certificate](./images/addToCertificate.png)

### Configure RFC Destinations

1. Enter transaction **/nsm59**.	
2. Choose **Create**.

   ![create RFC Destination1](./images/createRFCDestination1.png)
   
3. Enter a destination name **ACI_SAP_EM** and select the connection type **G Http connection to External Server** from the popup which appears once you enter **G** in that field, choose the **Save** icon.
   
    ![create RFC Destination11](./images/createRFCDestination11.png)

4. Choose **Continue** for the popup that says information **HTTP Connections may not be secure**.
5. Switch to the text editor where you have copied the Service Key of the SAP Event Mesh service instance in the first section above. Copy the value of **uri** for the protocol **httprest**.
6. Switch back to the **RFC Destination** tab and in the field **Target Host**, enter the URI which you copied excluding **https://**, for example: enterprise-messaging-pubsub.cfapps.eu10.hana.ondemand.com. Choose the **Save** icon and then choose **Connection Test**.

   ![create RFC Destination12](./images/createRFCDestination12.png)
   
7. The connection test has to give a response of **Status HTTP Response** as **200** and **Status Text** as **Ok**. If not, check if the target host field is entered properly.

   ![create RFC Destination13](./images/createRFCDestination13.png)
   
8. Choose back icon to create a second RFC Destination.
9. Choose **Create** like in step 2.
10. Enter a destination name **ACI_SAP_EM_TOKEN**, choose connection type **G Http connection** from the drop down, and then choose the **Save** icon.
   
    ![create RFC Destination21](./images/createRFCDestination21.png)
   
11. Choose **Continue** for the popup that says information **HTTP Connections may not be secure**.
12. Switch to the text editor where you have copied the Service Key of the SAP Event Mesh service instance in the first section above. Copy the value of **tokenendpoint** excluding **https://** and **oauth/token** from the URL.	
13. Switch back to the **RFC Destination** tab and for field **Target Host**, enter the copied URL for example: **xxxxxx.authentication.eu10.hana.ondemand.com**. In the **Path Prefix** field, enter the value **/oauth/token**.

    ![create RFC Destination22](./images/createRFCDestination22.png)

14. Choose tabulator **Logon & Security** and scroll-down to Security options and select the radio button **active** for field **SSL** and for field **SSL Certificate**, select **Anonym SSL Certificate (Anonymous)** from the dropdown menu and choose **Save**.

    ![create RFC Destination23](./images/createRFCDestination23.png)
    
15.Then choose **Connection Test**. The connection test should give a response of **Status HTTP Response** as **401** and **Status Text** as **Unauthorized**. Choose  **Cancel** as this is expected here.

   ![create RFC Destination24](./images/createRFCDestination24.png)

### Configure Logical Message Types

WE81 (Logical message types) is a standard SAP parameter transaction code that is used to maintain the contents of VEDI_EDMSG database table. It does this by executing the table maintenance t-code SM30 in edit mode, assuming you have the appropriate authorisations.

1. Choose the back icon to go to the home screen and enter transaction **/nWE81** and then choose **Display/Change**. For the warning that the change is cross-client, choose **Ok**.

    ![goto Logical Msg Type](./images/gotoLogicalMsgType.png)
    
2. Choose field **New Entries**.
3. Add the following two Message types:
   - Enter Message Type: **Z_ACI_MSG_CREATE**
   - Enter any meaningful text in the field: **Short Text**
   - Add another Message Type: **Z_ACI_MSG_CHANGED**
   - Enter a meaningful short text.	
   - Choose **Save**.

   	![add Message Types](./images/addMessageTypes.png)

4. When you try to save, it prompts you to create a Transport Request for any Cross Object. Choose the **Create** icon to create a new Workbench request.

   ![prompt For Workbench Request](./images/promptForWorkbenchRequest.png)

5. Enter a meaningful text in the **Short Description** field and then choose **Save**.

   ![create Transport Request](./images/createTransportRequest1.png)

6. Choose the **Green tick mark** icon in the screen to save the Object in Transport. Once Transport is created, for any further cross object changes, you can capture the change in the same transport number/Request which you have created. You will be prompted with similar "Transport Request"/ "Customizing Request" in the next steps, you can reuse the same Transport request which you created now.

   ![create Transport Request](./images/createTransportRequest2.png)
   
### Activate Business Configuration Sets
> You have to do this once per SAP system.

1. Enter Transaction **/nSCPR20** to add a new BC Set.
2. As BC Set enter  **/ASADEV/ACI_BCSET_FRAMEWORK_SEM**, then select the **activation** icon.
   ![add bc set](./images/activate_bc1.png)

3. Confirm the next two popup screens.
   ![Prompt for Workbench Request](./images/promptWorkbenchRequest.png)

   ![Activation Option](./images/activationOptions.png)
    
4. As BC Set add **/ASADEV/ACI_BCSET_FX_CLIENT_SEM**, select the **activation** icon and again confirm the next two popups.
   ![add bc set](./images/activate_bc2.png)

### Activate Change Pointers for Message Types		
1. Enter Transaction **/nBD50**.
2. Choose **New Entries**.

   ![activate Change Pointer1](./images/activateChangePointer1.png)

3. Add the following 2 change pointers for message types:
   - Add Message Type **Z_ACI_MSG_CREATE**
   - Select the **Active** checkbox next to the message type
   - Add a second Message Type **Z_ACI_MSG_CHANGED**
   - Select the **Active** checkbox next to also this message type
   - Choose **Save**.
   
   ![activate Change Pointer2](./images/activateChangePointer2.png)
   
4. For the screen with **Prompt with Customization Request**, you have to create a new transport request and then choose **Ok** to save.
 
   ![activate Change Pointer3](./images/activateChangePointer3.png)

### Maintain Event Type Linkage 

1. Enter the Transaction **/nSWE2** and select **New Entries**.
   
     ![execute Cloud Secret](./images/eventtypelinkage.png)
  
   We now map the BusinessObjects events:
   
2. In the opened screen, enter the following values:
   - In the field **Object Category**, select **BOR Object Type**
   - In the field **Object Type**, select **BUS1006**
   - In the field **Event**, select **CREATED**
   - In the field **Receiver type**, select **Z_ACI_MSG_CREATE**
   - In the field **Receiver Function Module**, select **/ASADEV/ACI_EVENTS_TRIGGER**
   - Select the **Linkage Activated** checkbox
   - Choose **Save**
        
     ![createEventLinkage](./images/eventLinkageCreated2.png)
     
3. Select **New Entries**
4. In the opened screen, enter the following values:
   - In the field **Object Category**, select **BOR Object Type**
   - In the field **Object Type**, select **BUS1006**
   - In the field **Event**, select **CHANGED**
   - In the field **Receiver type**, select **Z_ACI_MSG_CHANGED**
   - In the field **Receiver Function Module**, select **/ASADEV/ACI_EVENTS_TRIGGER**
   - Select the **Linkage Activated** checkbox
   - Choose **Save** and then the **OK** (green-tick) icon for Transport Request.
        
     ![change Event Linkage](./images/changeEventLinkage.png)

### Set ISO standard with UTF-8

1. Enter Transaction **/nSPRO** and choose the **SAP Reference IMG** icon.

   ![display Reference Img](./images/displayReferenceImg.png)
   
2. Expand **SAP Customization Implementation Guide** > **Integration with Other SAP components** > **SAP NetWeaver AddOn for Event enablement** and choose the clock icon with tooltip **IMG:Activity** next to **Maintain Cloud Codepages**.	
   ![open ACI Cloud Pages](./images/openACICloudPages.png)
   
3. Choose **Display/Change** icon and then choose **New Entries**.

   ![new Entry CloudPages](./images/newEntryCloudPages.png)
   
4. Enter in the field **ISO** value as **UTF-8** and for the field **Code Page**, enter **4110**. Choose the **Save** icon and then the **OK** (green-tick) icon for Transport Request.

   ![enter UTF8](./images/enterUTF8.png)
   
5. Enter **Back** button to go to previous screen.

### Load Events into Cloud

1. Expand **SAP Customization Implementation Guide** > **Integration with Other SAP components** > **SAP NetWeaver AddOn for Event enablement** > and choose the clock icon with tooltip **IMG:Activity** next to **Maintain Import Events**. 

   ![open Import Events](./images/openImportEventsv3.png)
   
2. Choose **Display/Change** icon and choose **New Entries**.

   ![new Import Event](./images/newImportEvent.png)
   
4. In the field **Import Event**, enter the value **API**, choose **Save** and then the **OK** (green-tick) icon for Transport Request.

   ![save Import Event](./images/saveImportEvent.png)
   
5. Choose the **Back** button to go to previous screen.

### Summary
You have established the trust to SAP Event Mesh service, set up the connection and defined the message linkage objects. In the next steps, you will define the Add-on event instance and the content for it.


[SAP Help - SAP NetWeaver Add-On for Event enablement](https://help.sap.com/viewer/e966e6c0e61443ebaa0270a4bae4b363/1.0/en-US/3eba827c531344eb879d8e35022d90ba.html)
