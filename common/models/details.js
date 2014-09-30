var config = require("./config.js");

var GooglePlaces = require("googleplaces");
var googlePlaces = new GooglePlaces(config.apiKey, config.outputFormat);
var parameters;

/**
 * Place details requests - https://developers.google.com/places/documentation/#PlaceDetails
 */
parameters = {
    location:[-27.472177, -58.808674],
    name:"inmENZO bar"
};
googlePlaces.placeSearch(parameters, function (response) {
    //console.log(response.results[0]);

    googlePlaces.placeDetailsRequest({reference:response.results[0].reference}, function (response) {
     console.log(response.result.photos);
     });

});

"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CpQBiwAAADCuoPKYvFF1rX6Ey_nfm45uSc5GeFGqVWF7c09uFuvQ5_8jJeF0T-9qi1mFC9hwgXfVj9SBklyOseW6jzmvY2jRYsATFRr5tW78xA7vs6BM_Iy_-0fuf9-AnW7RnYnCUVBx1agCYp-QVKiqoAoKMO6xLR2NwksDjPoLiGOGmPDopGhsCYl0plW45si3GfRr6hIQJPr1n_ixYNRBtiK9vu0FHBoUozykStiTHkj3jIh6DGZ-1qVa8BM&key=AIzaSyAyeLAbHzmMtrjOO_yVwGYs4Xg7iYbpVdM"