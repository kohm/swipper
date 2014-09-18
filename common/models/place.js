var GeoPoint = require('loopback').GeoPoint;
module.exports = function(Place){
    Place.nearBy = function(northWest, southEast, cb) {
        var NW = new GeoPoint(JSON.parse(northWest));
        var SE = new GeoPoint(JSON.parse(southEast));
        Place.find({
            fields: {
                id: true,
                Name:true,
                Location: true,
                categoryId:true,
                cityId: true
            },
            where: {
                and: [
                    {'Location.lat': {between: [SE.lat,NW.lat]}},{'Location.lng': {between: [NW.lng,SE.lng]}}]}, limit:50
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
};