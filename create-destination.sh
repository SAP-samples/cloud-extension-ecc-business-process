#!/bin/bash

# Get Mockserver URL
echo "---> STEP 1: Get Mockserver URL"
ROUTE_TO_MOCK_APP=$(cf app mock-srv | grep 'routes:' | cut -d ':' -f 2 | xargs)
if [ "$ROUTE_TO_MOCK_APP" == "" ];
then
    echo "[ERROR]: No app found"
    exit 1
else 
    echo "[SUCCESS]: Route to app: ${ROUTE_TO_MOCK_APP}"
fi


# Create destination
echo "---> STEP 2: Create Destination"
DESTINATION_SERVICE_KEY=$( cf service-key BusinessPartnerValidation-dest key | sed '1,2d' )
DESTINATION_CLIENTID=$(echo $DESTINATION_SERVICE_KEY | jq -r ."clientid" )
DESTINATION_CLIENTSECRET=$(echo $DESTINATION_SERVICE_KEY | jq -r ."clientsecret" )
DESTINATION_URI=$(echo $DESTINATION_SERVICE_KEY | jq -r ."uri" )
DESTINATION_URL=$(echo $DESTINATION_SERVICE_KEY | jq -r ."url" )
DESTINATION_TOKEN=$( curl -s --location --silent --request POST "$DESTINATION_URL/oauth/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_secret=$DESTINATION_CLIENTSECRET" \
--data-urlencode "client_id=$DESTINATION_CLIENTID" \
--data-urlencode 'grant_type=client_credentials' | jq -r '."access_token"' )
DESTINATION_RESPONSE_CODE=$(curl --location --silent --write-out '%{http_code}' --output /dev/null --request \
POST "https://destination-configuration.cfapps.eu10.hana.ondemand.com/destination-configuration/v1/subaccountDestinations" \
--header "Authorization: Bearer $DESTINATION_TOKEN" \
--header "Content-Type: application/json" \
--data-raw "{
  \"Name\" : \"bupa\",
  \"Type\" : \"HTTP\",
  \"URL\" : \"$ROUTE_TO_MOCK_APP\",
  \"Authentication\" : \"NoAuthentication\",
  \"ProxyType\" : \"Internet\",
  \"Description\" : \"Mock Server\"
}")
if [ "$DESTINATION_RESPONSE_CODE" == "201" ];
then
    echo "[SUCCESS]: Destination \"bupa\" has been created."
elif [ "$DESTINATION_RESPONSE_CODE" == "409" ];
then
    echo "[INFO]: Destination \"bupa\" already exists!"
else 
    echo "[ERROR]: Error on destination creation! Error code: $DESTINATION_RESPONSE_CODE"
    exit 1
fi
