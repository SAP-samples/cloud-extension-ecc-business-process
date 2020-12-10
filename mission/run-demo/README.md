# Test Entire Business Scenario End to End
----------------
## Access Frontend Application

1. Go to your **SAP Cloud Platform Subaccount** and go to corresponding **Space**

   ![](./images/demo-01.png)

2. Access **Space** and select the **UI Application**

   ![](./images/demo-02.png)

   ![](./images/demo-03.png)

3. Start your Business Partner Validation Application

   ![](./images/ds1.PNG)

   ![](./images/ds2.PNG)

## Add new Business Partner in Backend

1. Login to your ECC System backend with **SAP Logon**

   ![](./images/ds3.PNG)

2. Go to transaction **bp**

   ![](./images/ds4.PNG)

3. Create a new **Business Partner**

    ![](./images/ds5.PNG)

    * Add address

    ![](./images/ds17.png)

    * Enter Full Name

    ![](./images/ds18.png)

    * Enter Street, Postal Code, City and Country

    ![](./images/ds7.PNG)

    * Set the Status to Central Block and click on Save

    ![](./images/ds8.PNG)

## Change Adress and Verify Business Partner in Frontend

1. Back at the reference application the newly created Business Partner is going to appear in the list of Business Partners

    ![](./images/demo-08.png)

2. Click on the new **Business Partner**

    ![](./images/ds9.PNG)

3. Click on **Edit**

    ![](./images/ds10.PNG)

4.  Change the **Address**, set the Status to **Verified** and click **Save**

    ![](./images/demo-07.png)

    ![](./images/ds11.PNG)

## Check Status of Business Partner in Backend

1. Go back to transaction **bp** in ECC System

    ![](./images/ds12.PNG)

2. Open the details of the Business Partner you have just set to **Verified**

    ![](./images/ds14.PNG)

3. **Search Term** field will be set to **Verified** and **Address** field will also reflect updated field.

    ![](./images/ds20.png)

4. Go to the **Status** tab and check whether the **Central Block** flag has been removed

    ![](./images/ds15.PNG)

## Logs and Troubleshooting

- Additionally you can check the logs of SAP NetWeaver Add-On for Event enablement as described in the chapter [Monitoring and Logging](https://help.sap.com/viewer/e966e6c0e61443ebaa0270a4bae4b363/1.0/en-US/cff1acd831f744d59697525702ed0d3e.html).



- Logs for your Serverless Function can be found in the Extension Center:

    ![](./images/demo-04.png)

    ![](./images/demo-05.png)

    ![](./images/demo-06.png)

    ![](./images/ds23.png)

- To monitor the Events from ECC open Transaction **SLG1** on your Backend

    ![](./images/slg1_transaction-01.png)

    ![](./images/slg1_transaction-02.png)

- In Transaction **SLG1** you can even view the trace of an event by choosing **More -> Views -> Show Trace**

    ![](./images/slg1_transaction-03.png)

    ![](./images/slg1_transaction-04.png)

- The regular SAP Cloud Platform Logs might also be helpful. Access the corresponding **Space** in your **Subaccount**. Then choose your Application and **Logs**.

    ![](./images/demo-09.png)

    ![](./images/demo-10.png)

- If you get the following error in the demo application log, check the [Virus Scan setup](https://help.sap.com/doc/saphelp_nw751abap/7.51.0/en-US/b5/5d22518bc72214e10000000a44176d/frameset.htm) of your ERP backend.
    
     ![](./images/virusscan.jpg)

