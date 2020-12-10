# SAP NetWeaver® Event Enablement Add-on 1.0 installation on new ERP 6.0 with Netweaver 7.5

This guide gives you a rough overview of the installations steps for the SAP NetWeaver® Event Enablement Add-on 1.0 for a Netweaver 7.5 system. 

For the installation you will need the installation package SAPK-100COINASANWEE from [SAP Support Portal]( https://launchpad.support.sap.com/#/softwarecenter)
with the following files:

* K-100COINASANWEE.SAR  SP00
* K-10001INASANWEE.SAR  SP01

Feature Package 1 (SP02) is not needed for this mission, but it could be necessary if you also want to receive and handle messages in the ERP backend - see [overview](https://help.sap.com/viewer/e966e6c0e61443ebaa0270a4bae4b363/1.0/en-US/4bd8777d7a674f1ba93e1da405e4b9df.html). 

In addition it could also be necessary to update the SPAM transaction to the latest version

Check also [SAP Note](https://launchpad.support.sap.com/#/notes/2927040) for more details and other SAP Netweaver versions.

**Persona:** ERP Administrator

## Step-by-step 


1. Navigate to Transaction SPAM and check the version. If SPAM version is not '0074' then upgrade to it. Download the latest file from SAP Support. See also this [blog](https://blogs.sap.com/2016/03/02/spam-saint-update-2/).
Then run the installation:

   ![](images/ecc3.png)
   
   ![](images/ecc4.png)
   
   ![](images/ecc5.png)
   
   ![](images/ecc6.png)
   
   Please note that it will take some time up to 30 min to upgrade the Support Package Manager. Once SPAM get upgraded you can see the upgraded version in header.
     
2. Now you can Navigate to Transaction SAINT from the home screen. File name will be be "K-100COINASANWEE.SAR". Click on Continue 2-3 times and then a popup will appear to give a Password. Enter password "76755BF26A".

   ![](images/ecc8.png)
   
   ![](images/ecc9.png)
   
   ![](images/ecc10.png)
   
   ![](images/ecc11.png)
   
   ![](images/ecc15.png)

    Please note that it will take some time up to 15-20 min to install the Add-ons. Once it's installed and you got the message for successful installation , you can assure from seeing the Add-on detail by going again to transaction /nSAINT.
 
   ![](images/ecc12.png)

   Congratulation!! you have downloaded the installation SP0 version.
 

3. Now you have to upgrade to SP1 Pack. For this Navigate to Transaction SPAM. File name will be "K-10001INASANWEE.SAR".

   ![](images/ecc3.png)
   
   ![](images/ecc4.png)
   
   ![](images/ecc5.png)
   
   ![](images/ecc6.png)
   
   ![](images/ecc7.png)
   
   ![](images/ecc14.png)
   
   ![](images/ecc13.png)
   
   Once it's installed and you got the message for successful installation , you can assure from seeing the Add-on detail by going again to transaction /nSAINT.
   
   ![](images/ecc16.png)
   
   

   
   
   
   
   
 

   
   
   
 






