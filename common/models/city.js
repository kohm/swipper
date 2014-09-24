module.exports = function(City){
    City.allCities= function(msg, cb) {
        City.find({
            include:{'state':'country'}
        },function (err,result){
            console.log(result);
            cb(err,result);
        });
    };

    City.remoteMethod(
        'allCities',
        {
            accepts: {arg:'msg',type:'string'},
            returns: {arg: 'places', type: [City], root: true}
        }
    );
};