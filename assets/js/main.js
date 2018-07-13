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
    $('.favCities').append('<button class="favCityButton" value="' + cityName + '">' + cityName + '</button>');
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


// Attempt to get city-name on click
$(document).on('click', '.favCityButton', function () {
  // This global variable is to be passed Foursquare AJAX call
  $('.city-form').empty();
  $('.city-venues').empty();
  nearVenue = $(this).val();
  newForm = $('<form>');
  newForm.append('<input class="formInput" type="text" value="What would you like to do here?">');
  newForm.append('<button class="formSubmit">Submit</button>')
  $('.city-form').append(newForm);
  return nearVenue;
});

$(document).on('click', '.formSubmit', function (event) {
  event.preventDefault();
  $('.city-venues').empty();
  var searchTerm = $('.formInput').val().trim();
  // AJAX call for venue name limit 10
  var queryURL = 'https://api.foursquare.com/v2/venues/search?near=' + nearVenue + '&query=' + searchTerm + '&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (data) {
    console.log(data.response);
    // Here we save the name 
    var venues = data.response.venues;
    $.each(venues, function (i, venue) {
      var queryName = venue.name;
      var lat = venue.location.lat;
      var lng = venue.location.lng;
      var newVenueButton = $('<button class="venueButton">' + queryName + '</button>');
      newVenueButton.attr({
        latitude: lat,
        longitude: lng
      });
      $('.city-venues').append(newVenueButton);
      console.log(queryName);
    });
  });
  // Here we grab the id to display photo later
  // $.each(venues, function (i, venue) {
  //   var queryId = venue.id;
  //   console.log(queryId);
  // })
});

//=====================================

// Eric & Benji
jQuery.ajaxPrefilter(function(options) {

  $(document).on("click",".formSubmit",function(){
      var searchTerm = $('.formInput').val().trim();

        database.ref('cities/' + cityName).on('value', function (snapshot) {
        var cityLat = snapshot.val().lat;
        var cityLong = snapshot.val().long;
    
    var yelpURL = 'https://api.yelp.com/v3/businesses/search?latitude=' + venueLat + '&longitude=' + venueLong + '&searchTerm=' + searchTerm;

  if (options.crossDomain && jQuery.support.cors) {
      options.url = 'https://cors-anywhere.herokuapp.com/' + yelpURL;
  } $.ajax({
    url: options.url,
    method: 'GET',
    headers:{
      authorization: "Bearer pi1sE9K0i_sVdhYgLAKtZdlcG6z5H3Sxeyhs-a-MXO055d68GMzmV8MRoCQjj_zqdIUIhlAX1zMJ3BK5Wn-n0iZe4poD9xW2QJGN3E1UfuXCd0YITiAk1DIczOhAW3Yx"
    }
    }).then(function (data) {
    console.log(data);
    var businesses = data.businesses;
        $.each(businesses, function (i, businesses) {
          console.log(businesses.name);
        })
      })
    })
  })
});