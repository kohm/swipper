var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
parameters = {
    location:[-27.472139, -58.808883],
    name:"inmenzo bar"
};
googlePlaces.placeSearch(parameters, function (response) {
    if(response.status != 'ZERO_RESULTS'){
    googlePlaces.placeDetailsRequest({reference:response.results[0].reference}, function (response) {
        console.log(response.result.opening_hours.periods);
    });
    }
});