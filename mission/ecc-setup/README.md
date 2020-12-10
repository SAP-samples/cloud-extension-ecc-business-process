#   Configure ERP 6.0 Backend

Before starting the development of the OData services we have to do some preconfigurations.

## Activate IWBEP Service
1. Call transaction /nSICF
   
   ![SICF](images/eccsetup-1.png)

2. Select the DEFAULT_HOST and click OK
   
   ![Default Host](images/eccsetup-2.png)

3. In the service list select SAP -- iwbep
   
   ![Default Host](images/eccsetup-3.png)
   
4. Right-click on iwbep and activate the service
   
    ![Default Host](images/eccsetup-4.png)
    ![Default Host](images/eccsetup-5.png)


## Add Development User

1. Call transaction /nSU01
2. Enter a user name and select create.
   
   ![Default Host](images/eccsetup-7.png)

3. In the Address section enter User name and email address
   
   ![Default Host](images/eccsetup-8.png)

4. In the "Logon Data" section enter the initial password

   ![Default Host](images/eccsetup-9.png)

5. In the Roles section add the SAP_BC_DWB_APPDEVELOPER role.

   ![Default Host](images/eccsetup-13.png)

6. In the Profiles section add the SAP_ALL profile and press save

   ![Default Host](images/eccsetup-16.png)

This user can than also be used as technical user for the connection between the ERP system and your SAP Cloud Platform account. We will do this in later section.

## Activate HTTP ports and TLS v1.2

1. Call Transaction RZ10 - Select the DEFAULT Profile and Extended Maintanance - click on Change

   ![Default Host](images/eccsetup-18.png)

2. Check if the icm/server ports and the ssl/ciphersuites are enabled - if not set the values for HTTP, HTTPS and TLS v1.2 (ssl/ciphersuites, ssl/client_ciphersuites)

   ![Default Host](images/eccsetup-17.png)

    * [Blog: Activate HTTP, HTTPS and SMPT ](https://blogs.sap.com/2014/02/05/how-to-activate-and-define-http-https-smtp-ports-in-any-sap-r3-system/)
    * [Blog: How to Enable TLS v1.2 in SAP Netweaver ABAP](https://blogs.sap.com/2019/11/11/how-to-enable-tls-v1.2-in-sap-netweaver-abap/)

3. If you have done changes save the Default profile and call transaction /nSMICM - make a global shutdown and restart your System
   
   ![Default Host](images/eccsetup-19.png)

  