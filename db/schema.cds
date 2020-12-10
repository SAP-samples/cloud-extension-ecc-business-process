namespace my.businessPartnerValidation;
using { managed, cuid } from '@sap/cds/common';

entity Notifications: managed, cuid {
  businessPartnerId: String;
  businessPartnerName: String;
  verificationStatus: Association to StatusValues;
  addresses: Composition of many Addresses on addresses.notifications=$self;
}

entity Addresses:  cuid {
  notifications: Association to Notifications;
  addressId:String;
  country:String;
  cityName:String;
  streetName: String;
  postalCode: String;
  isModified: Boolean default false;
  businessPartnerId: String;
}
@cds.autoexpose
entity StatusValues {
  key code: String ;
    value: String;
    criticality: Integer;
    updateCode:Boolean;
}

annotate Notifications with {
  businessPartnerId @title:'BusinessPartner ID' @readonly;
  verificationStatus @title:'Verfication Status' @assert.enum;
}