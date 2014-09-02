var app = require('./server');
var dataSource = app.dataSources.mongo;
var Country = app.models.country;
var State = app.models.state;
var City = app.models.city;
var Place = app.models.place;
var Category = app.models.category;

var request = require("request");
var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtLTdISEl0TDBaWVU";
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
        Country.findOne({where: {Name: loc.Country}}, function (err, result) {
            if (!result) {
                var cou = {"Name": loc.Argentina};
                Country.create(cou, function (err, result) {
                    if (!err) {
                        console.log("Se creo el pais " + loc.Country);
                        createState(loc.State,result,function(state){
                            createCity(loc.City, state, function(city) {
                                createCategory(loc.Category, function(category){
                                    createPlace(loc, city, category, function(){
                                        processLocation(locations.shift(), callback);
                                    });
                                });
                            });
                        });
                    }else{
                        console.log(err);
                    }
                })
            } else {
                createState(loc.State,result,function(state){
                    createCity(loc.City, state, function(city) {
                        createCategory(loc.Category, function(category){
                            createPlace(loc, city, category, function(){
                                processLocation(locations.shift(), callback);
                            });
                        });
                    });
                });
            }
        });
    }else{
        callback();
    }
}
dataSource.automigrate('place', function (err){
    readJson(function(data){
        locations = data;
        locationCount = locations.length;
        processLocation(locations.shift(), function() {
            console.log("done");
        });
    });
});

var createState = function(name,country, callback){
    country.states({where: {"Name": name}}, function(err, stateResult){
        if(!stateResult[0]){
            country.states.create( {"Name": name}, function(err, result){
                if (!err) {
                    console.log("Se creo la provincia " + name);
                }
                else{
                    console.log(err);
                }
                callback(result);
            });
        }else{
            callback(stateResult[0]);
        }
    });
};
var createCity = function (name,state,callback){
    state.cities({where: {"Name": name}}, function(err, cityResult){
        if(!cityResult[0]){
            state.cities.create( {"Name": name}, function(err, result){
                if (!err) {
                    console.log("Se creo la ciudad " + name);
                }
                else{
                    console.log(err);
                }
                callback(result);
            });
        }else{
            callback(cityResult[0]);
        }
    });
}
var createCategory = function (category, callback){
    Category.findOne({where: {"Name": category}}, function(err, catResult){
        if(!catResult){
            Category.create({"Name":category}, function(err, result){
                if (!err){
                    console.log("Se creo la categoria " + category);
                }
                else{
                    console.log(err);
                }
                callback(result);
            });
        }else{
            callback(catResult);
        }
    });
}
var createPlace = function (location, city, category, callback){
    city.places.create({
        "Name": location.Name,
        "Address": location.Address,
        "Phone": location.Phone,
        "Location": JSON.parse(location.Location),
        "categoryId": category.id
    }, function(err, result){
        if(!err){
            callback(result);
        }else{
            console.log(err);
        }

    });
}