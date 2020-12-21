#   Configure ERP 6.0 Backend

Before starting the development of the OData services we have to do some preconfigurations.

## Add Development User

1. Call transaction /nSU01
2. Enter a user name and select create.
   
   ![Default Host](images/eccsetup-7.png)

3. In the Address section enter User name and email address
   
   ![Default Host](images/eccsetup-8.png)

4. In the "Logon Data" section enter the initial password

   ![Default Host](images/eccsetup-9.png)

5. In the Roles section add the SAP_BC_DWB_ABAPDEVELOPER role.

   ![Default Host](images/eccsetup-13.png)

6. In the Profiles section add the SAP_ALL profile and press save

   ![Default Host](images/eccsetup-16.png)

This user can than also be used as technical user for the connection between the ERP system and your SAP Cloud Platform account - just for testing not for production usage. We will do this in a later section.

## Activate HTTP ports and TLS v1.2

1. Call Transaction RZ10 - Select the DEFAULT Profile and Extended Maintanance - click on Change

   ![Default Host](images/eccsetup-18.png)

2. Check if the icm/server ports and the ssl/ciphersuites are enabled - if not set the values for HTTP, HTTPS and TLS v1.2 (ssl/ciphersuites, ssl/client_ciphersuites)

   ![Default Host](images/eccsetup-17.png)

    * [Blog: Activate HTTP, HTTPS and SMPT ](https://blogs.sap.com/2014/02/05/how-to-activate-and-define-http-https-smtp-ports-in-any-sap-r3-system/)
    * [Blog: How to Enable TLS v1.2 in SAP Netweaver ABAP](https://blogs.sap.com/2019/11/11/how-to-enable-tls-v1.2-in-sap-netweaver-abap/)

3. If you have done changes save the Default profile and call transaction /nSMICM - make a global shutdown and restart your System
   
   ![Default Host](images/eccsetup-19.png)

## Make Your Client Modifiable
>This step is necessary for client 000 when using the SAP CAL instance.

![](./images/trans1.png)

![](./images/trans2.png)

![](./images/trans3.png)

![](./images/trans4.png)

![](./images/trans5.png)

Navogate to Change mode --> Select "Automatic Recording of changes" --> Save it.

![](./images/trans6.png)

## Switch off your Virus Scannner for smooth inflow of update Data from Cloud Application Programming into ECC Business Partner oData API 

> Necessary when using the SAP CAL instance. Please note that this way is just for scenario validation and is not recommended in real productive scenario as this can make system vulnerable.

Naviage to Transaction /N/IWFND/VIRUS_SCAN
![](images/virus.png)
  