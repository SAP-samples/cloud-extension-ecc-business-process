using my.businessPartnerValidation as my from '../db/schema';
using API_BUSINESS_PARTNER as BUPA_API from './external/API_BUSINESS_PARTNER';
namespace service.businessPartnerValidation;
 
 
service SalesService  @(requires:'authenticated-user'){
   @odata.draft.enabled
   entity Notifications as projection on my.Notifications;
   entity Addresses as projection on my.Addresses;

  @readonly entity BusinessPartnerAddress as projection on BUPA_API.A_BusinessPartnerAddress{
     key BusinessPartner as businessPartnerId,
      AddressID as addressId,
      Country as country,
      CityName as cityName ,
      StreetName as streetName,
      PostalCode as postalCode
  };

  @readonly entity BusinessPartner as projection on BUPA_API.A_BusinessPartner{
     key BusinessPartner as businessPartnerId,
      BusinessPartnerFullName as businessPartnerName,
      SearchTerm1 as searchTerm1,
      BusinessPartnerIsBlocked as businessPartnerIsBlocked 
  };

  event BusinessPartnerVerified {
    businessPartner: String;
    businessPartnerName: String;
    verificationStatus: String;
    addressId: String;
    streetName: String;
    postalCode: String;
    country: String;
    addressModified: String;
  }

}


