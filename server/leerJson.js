var request = require("request")

var url = "https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtbDJtVmpmMktGbDA"

var readJson = function(callback){
    request({
        url: url,
        json: true,
        proxy: "http://proxy.corp.globant.com:3128"
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(body);

        }
    })

}

//var json = request('https://drive.google.com/uc?export=download&id=0B7dv4nAWOUhtbDJtVmpmMktGbDA');
