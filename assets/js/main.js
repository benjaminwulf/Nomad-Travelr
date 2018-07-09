/**********FourSquare***************/
$(document).ready(function() {
// Query for ll
// var ll = '45.5589522,-122.6517163'
// var queryURL = 'https://api.foursquare.com/v2/venues/search?ll=' + ll + '&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
// Query for near
var near = 'seattle'

//Global Variables
// var queryName = "";
// var queryId = "";
//=====================================
// AJAX call for venue name limit 10
var queryURL = 'https://api.foursquare.com/v2/venues/search?near=' + near + '&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
 $.ajax({
    url: queryURL,
    method: 'GET'
 }).then (function (data) {
console.log(data.response);
// Here we save the name 
var venues = data.response.venues;
    $.each(venues, function(i,venue){
        var queryName = venue.name;
        console.log(queryName);
        })
    // Here we grab the id to display photo
var id = data.response.id;
    $.each(venues, function(i,venue){
        var queryId = venue.id;
        console.log(queryId);
        })
    });
//=====================================

// Test call for venue details //bww
venueId = '4c3a70261a38ef3b69229321'
var queryVenueURL = 'https://api.foursquare.com/v2/venues/' + venueId + '?&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
$.ajax({
    url: queryVenueURL,
    method: 'GET'
}).then (function (data) {
    console.log(data);
});

// Test call for similar //bww works
var similarId = '4c3a70261a38ef3b69229321'
var querySimilarURL = 'https://api.foursquare.com/v2/venues/' + similarId + '/similar?&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
$.ajax({
    url: querySimilarURL,
    method: 'GET'
}).then (function (res) {
    console.log(res);
});

// end document ready
});
