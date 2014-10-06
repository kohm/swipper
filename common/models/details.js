var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
parameters = {
    location:[ -38.7207648, -62.2632232],
    name:'Bambu Canting'
};
googlePlaces.placeSearch(parameters, function (response) {
    if (response.status === "OK") {
        googlePlaces.placeDetailsRequest({reference: response.results[0].reference}, function (response) {
            console.log(response.result.opening_hours.periods);
        });
    }else{
        console.log(response);
    }
});