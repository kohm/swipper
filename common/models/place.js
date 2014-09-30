var GeoPoint = require('loopback').GeoPoint;


var config = require("./config.js");
var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;
/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
module.exports = function(Place){
    Place.nearBy = function(northWest, southEast, cb) {
        var NW = new GeoPoint(JSON.parse(northWest));
        var SE = new GeoPoint(JSON.parse(southEast));
        Place.find({
            include:{city:['state']},
            fields: {
                id: true,
                "Name":true,
                "Address":true,
                "Location": true,
                "categoryId":true,
                "cityId": true,
                "city.Name":true

            },
            where: {
                and: [
                    {'Location.lat': {between: [SE.lat,NW.lat]}},{'Location.lng': {between: [NW.lng,SE.lng]}}]}, limit:200
        },function (err,result){
            console.log(result);
            cb(err,result);
        });
    };

    Place.remoteMethod(
        'nearBy',
        {
            accepts: [{arg: 'northWest', type: 'GeoPoint'},{arg: 'southEast', type: 'GeoPoint'}],
            returns: {arg: 'places', type: [Place], root: true}
        }
    );

    /* OBTENER PLACE CON DETALLES DE LA API GOOGLE PLACES*/

    Place.details = function(idPlace, cb) {
        Place.findById(idPlace, function(err,result){
            console.log(result);

            parameters = {
                location:[-27.472177, -58.808674],
                name:"inmENZO bar"
            };
            googlePlaces.placeSearch(parameters, function (response) {
                //console.log(response.results[0]);

                googlePlaces.placeDetailsRequest({reference:response.results[0].reference}, function (response) {
                    result.reviews = response.result.reviews;
                    result.photos = response.result.photos;
                    cb(err,result);
                });

            });
        });
    };

    Place.remoteMethod(
        'details',
        {
            accepts: [{arg: 'idPlace', type: 'string'}],
            returns: {arg: 'place', type: 'string', root: true}
        }
    );

};