#!/bin/bash

ROUTE_TO_MOCKSERVER=$(cf app mock-srv | grep 'routes:' | cut -d ':' -f 2 | xargs) 
if [ "$ROUTE_TO_MOCKSERVER" == "" ];
then
    echo "[ERROR]: No app found"
    exit 1
else 
    echo "[SUCCESS]: Route to app: ${ROUTE_TO_MOCKSERVER}"
fi

NEW_DESTINATION_PARAMS="{\"HTML5Runtime_enabled\": \"true\", \"init_data\": {\"subaccount\": {\"existing_destinations_policy\": \"update\", \"destinations\": [{\"Name\": \"bupa\", \"Type\": \"HTTP\", \"URL\": \"${ROUTE_TO_MOCKSERVER}\", \"Authentication\": \"NoAuthentication\", \"ProxyType\": \"Internet\", \"Description\": \"Mock Server\"}]}}}"
cf update-service 'BusinessPartnerValidation-dest' -c "$NEW_DESTINATION_PARAMS"
