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
      var newButtonsDiv = $('<div class=newVenueButtons>')
      var queryName = venue.name;
      var lat = venue.location.lat;
      var lng = venue.location.lng;
      var newVenueButton = $('<button class="venueButton">' + queryName + '</button>');
      newVenueButton.attr({
        venueName: queryName,
        latitude: lat,
        longitude: lng
      });
      var newAddButton = $('<button class="addButton">+Add</button>');
      newAddButton.attr({
        cityName: nearVenue,
        venueName: queryName,
        latitude: lat,
        longitude: lng
      });
      var newUpVoteButton = $('<button class="upVoteButton"><i class="fas fa-thumbs-up"></i></button>');
      newUpVoteButton.attr({
        cityName: nearVenue,
        venueName: queryName,
        latitude: lat,
        longitude: lng
      });
      newButtonsDiv.append(newVenueButton, newAddButton, newUpVoteButton);
      $('.city-venues').append($(newButtonsDiv));
      console.log(queryName);
    });
  });
});

$(document).on('click', '.addButton', function (event) {
  event.preventDefault();
  var addedCity = $(this).attr("cityName")
  var addedVenueName = $(this).attr("venueName");
  var addedVenueLat = $(this).attr("latitude");
  var addedVenueLng = $(this).attr("longitude");
  database.ref(addedCity + '/venues/' + addedVenueName).set({
    venueName: addedVenueName,
    venueLat: addedVenueLat,
    venueLng: addedVenueLng
  });
  // database.ref(addedCity + '/venues').on("child_added", function (childSnapshot) {
  //   var newAddedVenueDiv = $('<div>');
  //   console.log(childSnapshot.val());
  //   // newAddedVenueDiv.text(childSnapshot)
  // });
});

// =========Fire base auth code==========
// This allows us to change what is displayed on the screen
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // Display Map If User is signed in.

    document.getElementById("loggedIn-view").style.display = "block";
    document.getElementById("login-view").style.display = "none";

    var user = firebase.auth().currentUser;
    // If we have a user we can use this to Display their name on the web page
    if(user != null){

      var email_id = user.email;

    }

  } else {
    // Display Log-in Page if user isnt signed in

    document.getElementById("loggedIn-view").style.display = "none";
    document.getElementById("login-view").style.display = "block";

  }
});

// =====RegisterUser=====
$("#register").on("click",function register(){
  var userEmail = document.getElementById("email-input").value;
  var userPass = document.getElementById("pass-input").value;

firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
 .catch(function (error) {
  console.log("Error : " + errorMessage);
  })})
  // ======LogOut Function====
  $("#logOut").on("click",function logout(){
    firebase.auth().signOut();
  })
// =====LogIn Function=====
  $("#logIn").on("click",function login(){
    
    var userEmail = document.getElementById("email-input").value;
    var userPass = document.getElementById("pass-input").value;
  
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log("Error : " + errorMessage);
    });
  
  })