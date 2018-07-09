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
  //INITIAL LOADING OF CITY NAMES WHEN PAGE IS REFRESHED
  database.ref().on("child_added", function (childSnapshot) {
    var cityName = (childSnapshot.val().cityName);
    var lat = childSnapshot.val().lat;
    var long = childSnapshot.val().long;
    $('.favCities').append('<button class="favCityButton">' + cityName + '</button>');
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