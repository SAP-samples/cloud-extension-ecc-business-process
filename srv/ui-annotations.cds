
 using service.businessPartnerValidation.SalesService as my from './service';

annotate my.Addresses with @(
    UI: {   
        HeaderInfo: {
            TypeName: 'Address',
            TypeNamePlural: 'Addresses',
            Title: { $Type: 'UI.DataField', Value: addressId }
        },
        SelectionFields: [ identifier, title, availability, price],
        LineItem: [
            {$Type: 'UI.DataField', Value: addressId},
            {$Type: 'UI.DataField', Value: businessPartnerId},
            {$Type: 'UI.DataField', Value: streetName},
            {$Type: 'UI.DataField', Value: cityName},
            {$Type: 'UI.DataField', Value: country},
            {$Type: 'UI.DataField', Value: postalCode}
        ],
        HeaderFacets: [
            {$Type: 'UI.ReferenceFacet', ID: 'BP', Target: '@UI.DataPoint#BP'},
            {$Type: 'UI.ReferenceFacet', ID: 'Status', Target: '@UI.DataPoint#Status'}
        ],
        DataPoint#BP: {Value: businessPartnerId, Title: 'Business Partner ID'},
        DataPoint#Status: {Value: notification.verificationStatus, Title: 'Verification Status'}
    }
);

annotate my.Addresses with {
    addressId @( Common.Label : 'Address ID' ) @readonly;
    businessPartnerId @( Common.Label : 'Business Partner ID' ) @readonly;
    streetName @( Common.Label : 'Street Name' );
    cityName @( Common.Label : 'City Name' ) @readonly;
    country @( Common.Label : 'Country' ) @readonly;
    postalCode @( Common.Label : 'Postal Code' );
}

annotate my.Notifications with {
    businessPartnerId @( Common.Label : 'Business Partner ID' );
    businessPartnerName @( Common.Label : 'Business Partner Name' ) @readonly;
    verificationStatus @( Common.Label : 'Verification Status' );
}

annotate my.Notifications with @(
    UI:{
        UpdateHidden: verificationStatus.updateCode,
        HeaderInfo: {
            TypeName: '{i18n>Notification}',
            TypeNamePlural: '{i18n>Notifications}',
            Title: { $Type: 'UI.DataField', Value: businessPartnerId }
        },
         SelectionFields: [ businessPartnerId, businessPartnerName,verificationStatus_code],
        LineItem: [
          {$Type: 'UI.DataField', Value: businessPartnerId},
          {$Type: 'UI.DataField', Value: businessPartnerName},
          {$Type: 'UI.DataField', Value: verificationStatus.value, Criticality: verificationStatus.criticality}
          
        ],
         HeaderFacets: [
             {$Type: 'UI.ReferenceFacet', ID: 'HeaderBpStatus', Target: '@UI.DataPoint#BpName'},
             {$Type  : 'UI.ReferenceFacet', Target : '@UI.FieldGroup#Detail'}
            
        ],
         Facets: [
            {$Type: 'UI.ReferenceFacet', Target: 'addresses/@UI.LineItem', Label: 'Address Facet'},
        ],
         DataPoint#BpName: {Value: businessPartnerName, Title: 'Business Partner Name'},
          FieldGroup #Detail : {Data : [
              {$Type: 'UI.DataField', Value: verificationStatus_code, Title: 'Verification Status'}
          ]}
    }
);

annotate my.Notifications @(
    Capabilities: {
        Insertable : false,
        Deletable : true,
        Updatable : true,
});

annotate my.Addresses @(
    Capabilities: {
        Deletable : false,
        Insertable : false,
});

annotate my.Notifications with {
    verificationStatus @(
        Common: {
        ValueList: {entity: 'StatusValues'},
        ValueListWithFixedValues,
        FieldControl: #Mandatory
    }
    );
};

annotate my.StatusValues with {
   code @Common : {
        Text            : value,
        TextArrangement : #TextOnly
    } @title :  'Code';
    value @title: 'Verification Status';
};




















