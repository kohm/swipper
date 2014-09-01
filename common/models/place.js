//{lat:-23, lng:-23}
module.exports = function(Place){

    Place.nearBy = function(location, radius, cb) {
        Place.find({limit: 3}, cb);
        //cb(null, 'Greetings... ');
    }

    Place.remoteMethod(
        'nearBy',
        {
            accepts: [{arg: 'location', type: 'geopoint'},{arg: 'radius', type: 'number'}],
            returns: {arg: 'places', type: [Place]},
            http: {verb: 'get'}
        }
    );
};