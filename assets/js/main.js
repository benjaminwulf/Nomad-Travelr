/**********FourSquare***************/
var ll = '45.5589522,-122.6517163'
var queryURL = 'https://api.foursquare.com/v2/venues/search?ll=' + ll + '&limit=10&client_id=ITN3RTSLWS0EZ1NZ0NKWQBNJBUSE2F44N43VS5ZI0BYN0EHA&client_secret=1GDMIQM0YKKKWYAQH0WVTAYBLIJ3YXZJMDIAOHDVFXFJI4DC&v=20140806'

 $.ajax({
    url: queryURL,
    method: 'GET'
 }).then (function (data) {
        console.log(data.response);
 });