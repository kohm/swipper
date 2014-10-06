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
            //console.log(result);

            parameters = {
                location:[result.Location.lat, result.Location.lng],
                name: result.Name
            };
            console.log(parameters);
            googlePlaces.placeSearch(parameters, function (response) {
                console.log(response);
                if (response.status === "OK"){
                    googlePlaces.placeDetailsRequest({reference:response.results[0].reference}, function (response) {
                        console.log(response.result);
                        if (response.result.opening_hours){
                            if (response.result.opening_hours.periods) {
                                var horarios = response.result.opening_hours.periods;
                                var horarios_count = horarios.length;
                                var horarios_formated = ["Close today", "Close today", "Close today", "Close today", "Close today", "Close today", "Close today"];
                                for (var i = 0; i < horarios_count; i++) {
                                    if (horarios_formated[horarios[i].open.day] === "Close today") {
                                        horarios_formated[horarios[i].open.day] = [horarios[i].open.time.slice(0, 2), ":", horarios[i].open.time.slice(2)].join('') + "-" +
                                            [horarios[i].close.time.slice(0, 2), ":", horarios[i].close.time.slice(2)].join('');
                                    } else {
                                        horarios_formated[horarios[i].open.day] = horarios_formated[horarios[i].open.day] + " " + [horarios[i].open.time.slice(0, 2), ":", horarios[i].open.time.slice(2)].join('') +
                                            "-" +
                                            [horarios[i].close.time.slice(0, 2), ":", horarios[i].close.time.slice(2)].join('');
                                    }
                                }
                                result.opening_hours = horarios_formated;
                            }
                        }
                        result.reviews = response.result.reviews;
                        result.photos = response.result.photos;
                        cb(err,result);
                    });
                }else{
                    cb(err,result);
                }
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