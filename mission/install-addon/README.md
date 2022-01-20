# Install SAP NetWeaver® Event Enablement Add-on 1.0 at SAP ERP 6.0 with NetWeaver 7.5 or SAP S/4HANA

This guide gives you a rough overview of the installations steps for the SAP NetWeaver® Event Enablement Add-on 1.0 for SAP NetWeaver 7.5 system. 

For the installation you will need the installation package SAPK-100COINASANWEE and the service packs 1-3 from [SAP Support Portal]( https://launchpad.support.sap.com/#/softwarecenter):

* **SAPK-100COINASANWEE**  Add-On Installation
* **SAPK-10001INASANWEE**  SP01
* **SAPK-10002INASANWEE**  SP02
* **SAPK-10003INASANWEE**  SP03

> For **SAP S/4HANA**: When you face errors during the installation like missing NetWeaver 7.31 packages, you have to install the *Attribute Change Package 13 for ASANWEE 100* **ASANWEE===100**

In addtion, see the [overview in the SAP Help Portal](https://help.sap.com/viewer/e966e6c0e61443ebaa0270a4bae4b363/1.0/en-US/4bd8777d7a674f1ba93e1da405e4b9df.html). 

It could also be necessary to update the SAP Patch Manager (SPAM) to the latest version.

Check also [SAP Note](https://launchpad.support.sap.com/#/notes/2927040) for more details and other SAP NetWeaver versions.

**Audience:** ERP Administrator or SAP S/4HANA Administrator depending on the SAP backend system you use.

## Step-by-Step 


1. Open SAP Patch Manager by calling transaction SPAM and check its version. If the SPAM version is not '0074', then upgrade to it. Download the latest file from the SAP Support Portal. See also the [SPAM / SAINT Update](https://blogs.sap.com/2016/03/02/spam-saint-update-2/) blog post.
Then run the installation:

   ![](images/ecc3.png)
   
   ![](images/ecc4.png)
   
   ![](images/ecc5.png)
   
   ![](images/ecc6.png)
   
   Note that it will take some time up to 30 minutes to upgrade the Support Package Manager. Once SPAM gets upgraded you can see the upgraded version in the header.
     
2. Navigate to **Transaction SAINT** from the home screen. The file name will be "K-100COINASANWEE.SAR". Choose Continue 2-3 times and then a popup will appear to ask for a password. Enter password **76755BF26A**.

   ![](images/ecc8.png)
   
   ![](images/ecc9.png)
   
   ![](images/ecc10.png)
   
   ![](images/ecc11.png)
   
   ![](images/ecc15.png)

    Note that it will take some time up to 15-20 minutes to install the add-ons. Once they are installed and you get the message for successful installation, you will see the add-on detail by going again to transaction /nSAINT.
 
   ![](images/ecc12.png)

   Result: You have downloaded the installation SP0 version.
 

3. Now you have to upgrade to SP1 Pack. To do this, navigate to transaction SPAM. File name will be "K-10001INASANWEE.SAR".

   ![](images/ecc3.png)
   
   ![](images/ecc4.png)
   
   ![](images/ecc5.png)
   
   ![](images/ecc6.png)
   
   ![](images/ecc7.png)
   
   ![](images/ecc14.png)
   
   ![](images/ecc13.png)
   
   Once SP1 Pack is installed and you get the message for successful installation, you can see the add-on detail by going again to transaction /nSAINT.
   
   ![](images/ecc16.png)
   
   Repeat the steps from section 3 for the SP2 K-10002INASANWEE.SAR and SP3 K-10003INASANWEE.SAR. 

   Now your SAP System is ready for messaging.


   

   
   
   
   
   
 

   
   
   
 






