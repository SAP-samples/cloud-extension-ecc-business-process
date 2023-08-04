const cds = require("@sap/cds");
const sinon = require("sinon");
const { expect } = require("chai");
const { GET, POST, PATCH } = cds
  .test("serve", "--in-memory", "--with-mocks")
  .in(__dirname + "/../../"); //.verbose(true)

const basicAuth = {
  headers: {
    Authorization: `Basic ${Buffer.from("admin:admin").toString("base64")}`,
  },
};

const postcodeValidatorMock = sinon.stub();
postcodeValidatorMock.returns(true);
sinon
  .stub(require("postcode-validator"), "postcodeValidator")
  .callsFake(postcodeValidatorMock);

describe("Sanity Test", () => {
  describe("Sales Service APIS GET should return 200", () => {
    it("Should return list of notifications", async () => {
      const response = await GET("/sales/Notifications", basicAuth);
      expect(response.status).to.eql(200);
    });

    it("Should return list of Business Partners", async () => {
      const response = await GET("/sales/BusinessPartner", basicAuth);
      expect(response.status).to.eql(200);
    });

    it("Should return list of Business Partners Address", async () => {
      const response = await GET("/sales/BusinessPartnerAddress", basicAuth);
      expect(response.status).to.eql(200);
    });

    it("Should return one notification by connecting to service", async () => {
      const SalesService = await cds.connect.to(
        "service.businessPartnerValidation.SalesService"
      );
      const { Notifications } = SalesService.entities;
      const result = await SELECT.one(Notifications);
      expect(result).to.deep.contains({
        businessPartnerId: "17100001",
        businessPartnerName: "TestData1",
      });
    });
  });

  describe("GET /api-business-partner/A_BusinessPartner should return 200", () => {
    it("should return 200 for list of  BusinessPartners", async () => {
      const response = await GET("/api-business-partner/A_BusinessPartner");
      expect(response.status).to.eql(200);
    });
  });
});

describe("Create and update a new business partner and verify", () => {
  it("Creates a new Business Partner", async () => {
    const payload = {
      BusinessPartner: "1710003",
      BusinessPartnerIsBlocked: true,
      BusinessPartnerFullName: "Testing name",
    };

    const response = await POST(
      "/api-business-partner/A_BusinessPartner",
      payload
    );
    expect(response.status).to.eql(201);
  });

  it("Update a value in newly created business partner", async () => {
    const payload = {
      BusinessPartnerIsBlocked: false,
    };

    const response = await PATCH(
      "/api-business-partner/A_BusinessPartner('1710003')",
      payload
    );
    expect(response.status).to.eql(200);
  });

  it("Verify the created and updated new Business Partner", async () => {
    const response = await GET(
      `/sales/Notifications?$filter=businessPartnerId eq '1710003'`,
      basicAuth
    );
    expect(response.status).to.eql(200);
    expect(response.data.value).to.exist;
    expect(response.data.value[0]).to.contains({
      businessPartnerName: "Testing name",
    });
  });
});

describe("Push new Notification to Draft state, Edit, Activate and Verify", () => {
  it("Push a new notification to draft state ", async () => {
    const response = await POST(
      `/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
      { PreserveChanges: true },
      basicAuth
    );
    expect(response.status).to.eql(201);
  });

  it("Update the verificationStatus_code in draft state", async () => {
    const response = await PATCH(
      `/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)`,
      { verificationStatus_code: "V" },
      basicAuth
    );
    expect(response.status).to.eql(200);
  });

  it("Veify the updated verfication status code", async () => {
    const response = await GET(
      `/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)`,
      basicAuth
    );
    expect(response.status).to.eql(200);
    expect(response.data).to.deep.contains({ verificationStatus_code: "V" });
  });

  it("Update the Side effects qualifier", async () => {
    const response = await POST(
      "/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftPrepare",
      { SideEffectsQualifier: "" },
      basicAuth
    );
    expect(response.status).to.eql(200);
  });

  it("Activate the draft notification", async () => {
    jest.spyOn(cds.ql, "UPDATE").mockImplementation(() => {
      return {
        with: jest.fn(),
      };
    });

    const response = await POST(
      "sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftActivate",
      {},
      basicAuth
    );
    expect(response.status).to.eql(201);
  });
});

describe("Push new Notification directly to Completed state and Verify", () => {
  it("Push new notification", async () => {
    const response = await POST(
      `/sales/Notifications(ID=ff0bc005-710c-4097-a687-64ef380498f4,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
      { PreserveChanges: true },
      basicAuth
    );
    expect(response.status).to.eql(201);
  });

  it("Update verificationStatus_code in draft state to Completed", async () => {
    const response = await PATCH(
      `/sales/Notifications(ID=ff0bc005-710c-4097-a687-64ef380498f4,IsActiveEntity=false)`,
      { verificationStatus_code: "C" },
      basicAuth
    );
    expect(response.status).to.eql(200);
    expect(response.data.verificationStatus_code).to.eql("C");
  });

  it("Should return 400 for activating the draft state whose verification status is marked as Completed", async () => {
    try {
      const response = await POST(
        "sales/Notifications(ID=ff0bc005-710c-4097-a687-64ef380498f4,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftActivate",
        {},
        basicAuth
      );

      expect.fail("Expected an error to be thrown.");
    } catch (err) {
      const errorData =
        err && err.response && err.response.data && err.response.data.error;
      expect(errorData && errorData.code).to.eql("400");
      expect(errorData && errorData.message).to.eql(
        "Cannot mark as COMPLETED. Please change to VERIFIED"
      );
      expect(errorData && errorData.target).to.eql("verificationStatus_code");
    }
  });
});

describe("Push new Notification to Invalid state and Verify", () => {
  it("Push new notification", async () => {
    const response = await POST(
      `/sales/Notifications(ID=16f00c9c-323f-4ce4-876f-efaefe1c6f69,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
      { PreserveChanges: true },
      basicAuth
    );
    expect(response.status).to.eql(201);
  });

  it("Update verificationStatus_code in draft state to Invalid", async () => {
    const response = await PATCH(
      `/sales/Notifications(ID=16f00c9c-323f-4ce4-876f-efaefe1c6f69,IsActiveEntity=false)`,
      { verificationStatus_code: "INV" },
      basicAuth
    );
    expect(response.status).to.eql(200);
    expect(response.data.verificationStatus_code).to.eql("INV");
  });

  it("Side effects qualifier", async () => {
    const response = await POST(
      "/sales/Notifications(ID=16f00c9c-323f-4ce4-876f-efaefe1c6f69,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftPrepare",
      { SideEffectsQualifier: "" },
      basicAuth
    );
    expect(response.status).to.eql(200);
  });

  it("Activate the draft notification", async () => {
    jest.spyOn(cds.ql, "UPDATE").mockImplementation(() => {
      return {
        with: jest.fn(),
      };
    });
    const response = await POST(
      "sales/Notifications(ID=16f00c9c-323f-4ce4-876f-efaefe1c6f69,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftActivate",
      {},
      basicAuth
    );
    expect(response.status).to.eql(201);
  });
});

describe("PATCH call for updating Address and verifying postal code", () => {
  it("Pushing active notification back to draft mode", async () => {
    const response = await POST(
      `/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)`,
      { PreserveChanges: true },
      basicAuth
    );
    expect(response.status).to.eql(201);
  });

  it("Should return 200 for updating the valid postal code", async () => {
    const payload = {
      country: "DE",
      cityName: "city",
      streetName: "street",
      postalCode: "560066",
    };
    const response = await PATCH(
      "/sales/Addresses(ID=58040e66-1dcd-4ffb-ab10-fdce32028b79,IsActiveEntity=false)",
      payload,
      basicAuth
    );
    expect(response.status).to.eql(200);
  });

  it("Should return 400 for updating the invalid postal code", async () => {
    try {
      const payload = {
        postalCode: "123234",
      };
      postcodeValidatorMock.returns(false);
      const response = await PATCH(
        "/sales/Addresses(ID=58040e66-1dcd-4ffb-ab10-fdce32028b79,IsActiveEntity=false)",
        payload,
        basicAuth
      );
      expect.fail("Expected an error to be thrown.");
    } catch (err) {
      const errorData =
        err && err.response && err.response.data && err.response.data.error;
      expect(errorData && errorData.code).to.eql("400");
      expect(errorData && errorData.message).to.eql("invalid postal code");
      expect(errorData && errorData.target).to.eql("postalCode");
    }
  });
});

describe("Validate Business Partner Address", () => {
  it("Creates a new business partner", async () => {
    const payload = {
      BusinessPartner: "17100001",
      BusinessPartnerIsBlocked: true,
      BusinessPartnerFullName: "Testing name",
    };

    const response = await POST(
      "/api-business-partner/A_BusinessPartner",
      payload
    );
    expect(response.status).to.eql(201);
  });

  it("Verify whether BusinessPartnerAddress is updated for newly created Business Partner", async () => {
    const response = await GET("/sales/BusinessPartnerAddress", basicAuth);
    expect(response.status).to.eql(200);
  });
});
