/*add this to your html -> <script src="https://storage.googleapis.com/code-snippets/rapidapi.min.js"></script> */
var rapid = new RapidAPI("default-application_5b29a84fe4b08122a9a22912", "77a8df6e-81f2-4f4e-b9e3-fd31fbd2e8bd");

rapid.call('YelpAPI', 'getAutocomplete', { 
	'accessToken': 'pi1sE9K0i_sVdhYgLAKtZdlcG6z5H3Sxeyhs-a-MXO055d68GMzmV8MRoCQjj_zqdIUIhlAX1zMJ3BK5Wn-n0iZe4poD9xW2QJGN3E1UfuXCd0YITiAk1DIczOhAW3Yx',
	'coordinate': '39.6951107, -104.98878309999999',
	'text': 'record shop'

}).on('success', function (payload) {
	 /*YOUR CODE GOES HERE*/ 
}).on('error', function (payload) {
	 /*YOUR CODE GOES HERE*/ 
});


$(document).on('click', "#search-button", function () {

var querySearch = "denver"

var queryURL = "https://api.yelp.com/v3/autocomplete" +

}