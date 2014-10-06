var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
parameters = {
    location:[-27.451449, -58.984438],
    name:'Delale'
};
googlePlaces.placeSearch(parameters, function (response) {
    if (response.status === "OK") {
        googlePlaces.placeDetailsRequest({reference: response.results[0].reference}, function (response) {
            console.log(response.result);
        });
    }else{
        console.log(response);
    }
});