var app = require('./server');
var dataSource = app.dataSources.mongo;
var Place = app.models.place;

var request = require("request");
//var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtTW9qVXFFaGdzWUE"; // 17/11/2014 Arg
var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtOVFleTlJX2pZS2s"; // 16/12/2014 Arg + Uru

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
        locations = data;
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
        case "Gas Stations":
            location.Category = "Gas";
            break;
        case "Restaurat":
            location.Category = "Food";
            break;
        case "Restaurants":
            location.Category = "Food";
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