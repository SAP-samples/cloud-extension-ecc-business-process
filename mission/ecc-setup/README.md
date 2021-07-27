#   Configure SAP ERP 6.0 (ECC) Backend

Before starting the development of the OData services we have to do some preconfigurations.

## Add Development User

1. Login to your SAP ECC system 000 with an administration user using SAP GUI.
2. Call transaction **/nSU01**
3. Enter a user name and select create.
   
   ![Default Host](images/eccsetup-7.png)

4. In the Address section enter User name and email address
   
   ![Default Host](images/eccsetup-8.png)

5. In the "Logon Data" section enter the initial password.

   ![Default Host](images/eccsetup-9.png)

6. In the Roles section add the SAP_BC_DWB_ABAPDEVELOPER role.

   ![Default Host](images/eccsetup-13.png)

7. In the Profiles section add the SAP_ALL profile and press save

   ![Default Host](images/eccsetup-16.png)

8. Login to your SAP ECC system with this user to change the initial password. 

This user can than also be used as technical user for the connection between the ERP system and your SAP BTP account - just for testing not for production usage. We will do this in a later section. 



## Activate HTTP ports and TLS v1.2

1. Again login to your SAP ECC system 000 with an administration user using SAP GUI.
2. Call Transaction **RZ10** - Select the DEFAULT Profile with the latest **Version** and Extended Maintenance - click on Change

   ![Default Host](images/eccsetup-18.png)

3. Check if the icm/server ports and the ssl/ciphersuites are enabled - if not set the values for HTTP, HTTPS and TLS v1.2 (ssl/ciphersuites, ssl/client_ciphersuites)

   ![Default Host](images/eccsetup-17.png)

    * [Blog: Activate HTTP, HTTPS and SMPT ](https://blogs.sap.com/2014/02/05/how-to-activate-and-define-http-https-smtp-ports-in-any-sap-r3-system/)
    * [Blog: How to Enable TLS v1.2 in SAP Netweaver ABAP](https://blogs.sap.com/2019/11/11/how-to-enable-tls-v1.2-in-sap-netweaver-abap/)

4. If you have done changes save the Default profile and call transaction /nSMICM - make a global shutdown and restart your System
   
   ![Default Host](images/eccsetup-19.png)

## Check your HTTP and HTTPS ports in SMICM
1. Call transaction **/nsmicm** to open ICM Monitor.
2. Click on 'Services' 

   ![open smicm](./images/smicm_1.png)
   
3. View the HTTP and HTTPS ports and make a note of the port numbers for the next step of SAP Cloud Connector connection setup.

   ![open smicm](./images/smicm_2.png)
   
## Make Your Client Modifiable
>This step is necessary for client 000 when using the SAP CAL instance.

1. Call transaction **SE03**
2. In the **Administration** section select **Set System Change Option**

   ![](./images/trans1.png)

3. Choose **More**

   ![](./images/trans2.png)

4. Set **Edit** > **Software Components Modifiable** and **Edit** > **Namespaces Modifiable** 
   
   ![](./images/trans3.png)

5. Select **Client Setting**

   ![](./images/trans4.png)


6. Select the **Client 000**
   
   ![](./images/trans5.png)

7. Navigate to **Change and Transports for Client-Specific Objects**, choose **Automatic Recording of changes** and save it.

   ![](./images/trans6.png)

## Switch off your Virus Scannner for smooth inflow of update Data from Cloud Application Programming into ECC Business Partner oData API 

> Necessary when using the SAP CAL instance. Please note that this way is just for scenario validation and is not recommended in real productive scenario as this can make system vulnerable.

1. Navigate to Transaction **/N/IWFND/VIRUS_SCAN** 
2. Check ** Virus Scan Switched Off**
3. Save your changes
   
   ![](images/virus.png)
  
