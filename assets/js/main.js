var config = {
  apiKey: "AIzaSyDc0MYK3lccz5SXqIM5E4v0gqHpbuU_tQQ",
  authDomain: "nomad-travelr.firebaseapp.com",
  databaseURL: "https://nomad-travelr.firebaseio.com",
  projectId: "nomad-travelr",
  storageBucket: "",
  messagingSenderId: "588346345795"
};
firebase.initializeApp(config);

var database = firebase.database();
var map, infoWindow;
var cityName = [];
// Global variable for searching with Foursquare API
var nearVenue = "";

//INTIAL MAP FUNCTION
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {
      lat: 0,
      lng: 0
    }
  });
  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function () {
    geocodeAddress(geocoder, map);
  });
  // INITIAL LOADING OF CITY NAMES WHEN PAGE IS REFRESHED
    database.ref().on("child_added", function (childSnapshot) {
      cityName = (childSnapshot.val().cityName);
      var lat = childSnapshot.val().lat;
      var long = childSnapshot.val().long;

// =======================
//BWW
  // Dynamically generate button for each item in array cityName
  var a = $("<button class='favCityButton'></button>");
  // Add class
  a.attr("city-name", cityName);
  // Create button text with value of cityName at index i
  a.text(cityName);
  // Add buttons to div class '.favCities'
  $('.favCities').append(a);
  
  // Attempt to get city-name on click
  $('.favCityButton').each(function() {
    $(this).on('click', function () {
      
      // This global variable is to be passed Foursquare AJAX call
      nearVenue = $(this).attr('city-name');
      // BWW console log of on click event of city
      venueOnClick(nearVenue);
      console.log(nearVenue);
      })
  });

      // BWW this I commented out as it it done above
      //  $('.favCities').append('<button class="favCityButton">' + cityName + '</button>');
  // ========================

       var marker = new google.maps.Marker({
         map: map,
         position: {
           lat: lat,
           lng: long
           }
         })
    });
  }

//FUNCTIONS THAT ADD A SEARCH BAR TO THE MAP AND GEOCODE BASED ON THE NAME INPUT - puts a marker when you add the place to "My Cities"

function geocodeAddress(geocoder, resultsMap) {
  var address = $('#address').val().trim();
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      resultsMap.setZoom(8);
      $('#favorites').on('click', function (event) {
        event.preventDefault();
        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });
        var cityNameSearch = results[0].formatted_address;
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        database.ref(cityNameSearch).set({
          cityName: cityNameSearch,
          lat: latitude,
          long: longitude
        });
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
// =========================
// BWW
//==========================
    // AJAX call for venue name limit 10
    function venueOnClick(nearVenue) {
    var queryURL = 'https://api.foursquare.com/v2/venues/search?near=' + nearVenue + '&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
     $.ajax({
        url: queryURL,
        method: 'GET'
     }).then (function (data) {
    console.log(data.response);
    // Here we save the name 
    var venues = data.response.venues;
        $.each(venues, function(i,venue){
            var queryName = venue.name;
            // BWW this only return one venue ???
            // $('.city-venues').html(queryName);
            $('.city-venues').append(queryName);
            console.log(queryName);
            })
        // Here we grab the id to display photo later
        $.each(venues, function(i,venue){
            var queryId = venue.id;
            console.log(queryId);
            })
        });
      };
    //=====================================