var app = require('./server');
var dataSource = app.dataSources.mongo;
var Place = app.models.place;

var request = require("request");
//var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtTW9qVXFFaGdzWUE"; // 17/11/2014 Arg
//var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtYm5Ebl92M2hqY00"; // 16/12/2014 Arg + Uru well formed
//var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtelFnZWE0WkFvSFE"; // 16/12/2014 Arg + Uru + world
var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtVkF5bUY3eUdKV0U"; // 16/12/2014 Arg + Uru + world + Esp (solicitud de Migue para los chicos de Madrid Globant)


var readJson = function(callback){
    request({
        url: url,
        json: true
        //proxy: "http://proxy.corp.globant.com:3128"
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body);

        }
    })
};
dataSource.automigrate();

var locations;
var locationCount;
function processLocation(loc, callback) {
    if (loc) {
        createPlace(loc, function(){
            processLocation(locations.shift(), callback);
        });
    }else{
        callback();
    }
}
var toTitleCase = function(str){

    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

};

var normalize = function(collection) {
    collection.forEach(function(each){
        each.Name = toTitleCase(each.Name);
        each.Address = toTitleCase(each.Address);
        each.Category = toTitleCase(each.Category);
        each.City = toTitleCase(each.City);
        each.State = toTitleCase(each.State);
        each.Country = toTitleCase(each.Country);

    });
};
dataSource.automigrate('place', function (err){
    readJson(function(data){
        
        /** FUNCION QUE ELIMINA LOS LUGARES CON COORDENADAS REPETIDAS **/
        function arrUnq (db){
            
            var dbLength = db.length;
            console.log(db[0]);
            console.log(db[0].Location);
            console.log(db[0].Location[0]);
            var cleaned = [];
            var cant = 0;
            for (var i = 0; i < dbLength; i++){
                var noRepeated = true;
                //console.log(JSON.parse(db[i].Location).lat);
                for (var j = 0; j < dbLength; j++){
                    if ( (JSON.parse(db[i].Location).lat === JSON.parse(db[j].Location).lat) && (JSON.parse(db[i].Location).lng === JSON.parse(db[j].Location).lng) && (i != j)){
                        noRepeated = false;
                    }
                }
                if (noRepeated){
                    cleaned.push(db[i]);
                    cant++;
                }
            }
            console.log((dbLength - cant) + " fueron eliminados");
            return cleaned;
        }
        locations = arrUnq(data);
        normalize(locations);
        locationCount = locations.length;
        processLocation(locations.shift(), function() {
            console.log("done");
        });
    });
});
var createPlace = function (location,callback){
    if (location.Category === "Lodging Small"){
        location.Category = "Lodging"
    }
    switch(location.Category) {
        case "Lodging Small":
            location.Category = "Lodging";
            break;
        case "Hotel":
            location.Category = "Lodging";
            break;
        case "Transporte":
            location.Category = "Car Rental";
            break;
        case "Gas Stations":
            location.Category = "Gas";
            break;
        case "Restaurants":
            location.Category = "Food";
            break;
        case "Restaurant":
            location.Category = "Food";
            break;
    }
    Place.create({
        "Name": location.Name,
        "Address": location.Address,
        "Phone": location.Phone,
        "Location": JSON.parse(location.Location),
        "Category": location.Category,
        "City": location.City,
        "State": location.State,
        "Country": location.Country
    }, function(err, result){
        if(!err){
            callback(result);
        }else{
            console.log(err);
        }

    });
}