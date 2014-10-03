var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
parameters = {
    location:[-27.450458,-58.98377],
    name:"hotel colon"
};
googlePlaces.placeSearch(parameters, function (response) {
    googlePlaces.placeDetailsRequest({reference:response.results[0].reference}, function (response) {
        console.log(response.result.periods);
    });
});