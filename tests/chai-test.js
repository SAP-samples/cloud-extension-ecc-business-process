const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("./chai-serve");

// Configure chai
chai.use(chaiHttp);
chai.should();

let app = null;

before((done) => {
	server.then((result) => {
		app = result;
		done();
	});
});

describe("Sanity Test", () => {
	describe("GET /sales/Notifications", () => {
		it("+ should return a list of notifications", (done) => {
			chai.request(app)
				.get("/sales/Notifications")
				.auth("test:test")
				.end((error, response) => {
					try {
						response.should.have.status(200);
						response.body.value.should.be.an("array").to.have.lengthOf(2);
						done();
					} catch (error) {
						done(error);
					}
				});
		});
	});

	describe("GET /api-business-partner/A_BusinessPartner", () => {
		it("+ should reach mock implementation", (done) => {
			chai.request(app)
				.get("/api-business-partner/A_BusinessPartner")
				.end((error, response) => {
					try {
						response.should.have.status(200);
						done();
					} catch (error) {
						done(error);
					}
				});
		});
	});
});

describe("Business Partner Validation", () => {
	it("+ create new business partner", (done) => {
		const payload = {
			"BusinessPartner":"17100015",
			"BusinessPartnerIsBlocked":true,
			"BusinessPartnerFullName": "first lastname"
		}
		chai.request(app)
			.post("/api-business-partner/A_BusinessPartner")
			.send(payload)
			.end((error, response) => {
				try {
					response.should.have.status(201);
					done();
				} catch (error) {
					done(error);
				}
			});
	});



	it("+ should return a list of new notifications", (done) => {
			chai.request(app)
			.get("/sales/Notifications?$filter=businessPartnerId eq '17100015'")
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(200);
					response.body.value.should.be.an("array").to.have.lengthOf(1);
					done();
				} catch (error) {
					done(error);
				}
			});
	});


	describe("Draft Choreography", () => {

		it("+ set the Notification to draft", (done) => {
			chai.request(app)
			.post("/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)/service.businessPartnerValidation.SalesService.draftEdit?$select=HasActiveEntity,HasDraftEntity,ID,IsActiveEntity,businessPartnerId,businessPartnerName,verificationStatus_code&$expand=DraftAdministrativeData($select=DraftUUID,InProcessByUser),verificationStatus($select=code,updateCode)")
			.send({"PreserveChanges":true})
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(201);
					done();
				} catch (error) {
					done(error);
				}
			});
		});
		it("+ patch the changes", (done) => {
			chai.request(app)
			.patch("/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)")
			.send({"verificationStatus_code": "V"})
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(200);
					done();
				} catch (error) {
					done(error);
				}
			});
		});
		it("+ Side effects qualifier", (done) => {
			chai.request(app)
			.post("/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftPrepare")
			.send({ "SideEffectsQualifier": "" })
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(200);
					done();
				} catch (error) {
					done(error);
				}
			});
		});
		/*it("+ Activate the draft", (done) => {
			chai.request(app)
			.post("/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=false)/service.businessPartnerValidation.SalesService.draftActivate")
			.send({ "SideEffectsQualifier": "" })
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(201);
					done();
				} catch (error) {
					done(error);
				}
			});
		});

		it("+ Test the verfication status", (done) => {
			chai.request(app)
			.get("/sales/Notifications(ID=2c728381-72ce-4fdd-8293-8add71579666,IsActiveEntity=true)")
			.auth("test:test")
			.end((error, response) => {
				try {
					response.should.have.status(200);
					response.body.verificationStatus_code.should.equal("V");
					done();
				} catch (error) {
					done(error);
				}
			});
		});*/

	});



});
