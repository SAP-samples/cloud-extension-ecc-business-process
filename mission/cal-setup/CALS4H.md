# Create a Test SAP S/4HANA System Using SAP Cloud Appliance Library

If you don't own a SAP S/4HANA system, you could use the 30 day trial version. As a prerequisite, you need either an Azure, AWS or Google account. For the operation costs you will be charged by the account provider. 
You can create an instance at [SAP S/4HANA 2021, Fully-Activated Appliance](https://cal.sap.com/catalog#/applianceTemplates/a954cc12-da16-4caa-897e-cf84bc74cf15). You have to log on and choose **Create Instance** on the top right.

To run the mission, you will need to activate these components:
* SAP NetWeaver 7.50 SP 16 AS JAVA with Adobe Document Services
* SAP S/4HANA 2021  & SAP HANA DB 2.0 
* Windows Remote Desktop

In the SAP S/4HANA system use client 100. 
The SAP S/4HANA CAL image includes a Windows system which already has SAP GUI and an installed SAP Cloud Connector (see the 'Welcome page' in the Windows Desktop once you activate and run the system).

Also, in the section **Access Points** of your SAP Cloud Appliance Library image, add the ports for HTTP and HTTPS. In this mission, we have used for HTTP - 50000 and for HTTPS - 44300. Only after you allow these access points, the ports for HTTP and HTTPS will be opened. 
You find more information about the SAP S/4HANA trial systems in the following blog post and the Getting Started Guide:

* [Blog post: SAP S/4HANA Fully-Activated Appliance](https://blogs.sap.com/2018/12/12/sap-s4hana-fully-activated-appliance-create-your-sap-s4hana-1809-system-in-a-fraction-of-the-usual-setup-time/)
* [Getting Started Guide](https://www.sap.com/cmp/oth/crm-s4hana/s4hana-on-premise-trial.html?pdf-asset=4276422b-487d-0010-87a3-c30de2ffd8ff&page=20)
