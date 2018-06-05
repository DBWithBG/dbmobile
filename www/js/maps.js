var map,marker,user_pos;
var serv = 'http://dev-deliverbag.supconception.fr/';
var mapStyle = ` [{"featureType":"administrative","stylers":[{"visibility":"on"}]},{"featureType":"administrative.country","stylers":[{"visibility":"on"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","stylers":[{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"color":"#e9e5dc"}]},{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"color":"#b8cb93"},{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.attraction","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"poi.government","stylers":[{"visibility":"off"}]},{"featureType":"poi.medical","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#ccdca1"}]},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi.park","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","stylers":[{"visibility":"off"}]},{"featureType":"poi.school","stylers":[{"visibility":"off"}]},{"featureType":"poi.sports_complex","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"hue":"#ff0000"},{"saturation":-100},{"lightness":100}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"color":"#808080"},{"lightness":54},{"visibility":"off"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#767676"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","stylers":[{"weight":"1.74"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"hue":"#ff0000"},{"visibility":"on"},{"weight":"4.98"}]},{"featureType":"road.highway","stylers":[{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"},{"weight":"0.01"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.bus","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.rail","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#6abcd1"},{"saturation":"0"},{"lightness":"0"},{"gamma":"1"},{"weight":"1"}]}] `;

document.addEventListener('deviceready', function () {

  navigator.splashscreen.hide();
  var today =  new Date().toISOString().split('T')[0] ;
  $('#date').attr('min',today);
  initMap();
  checkGps();
  // requests();



});

/*
** function called when geolocation is active and refresh user_pos
** @param position : actual user_pos
*/
function succes_gps(position){

  user_pos = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
  marker.setPosition(user_pos);
  marker.setMap(map);


}

function error_gps(){
  checkGps();
}


/*
** check if GPS is active
** if not, ask the user to turn it on
*/
function checkGps(){
  cordova.plugins.locationAccuracy.request(succes_gps, error_gps , cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
}

/*
** 1st initializion of the map & marker objects
** called when googleMapScript is loaded
*/

function initMap() {
  //window.open = cordova.InAppBrowser.open;


  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 48.6843900, lng: 6.1849600},
    zoom: 12,
    disableDefaultUI: true,
    gestureHandling: "greedy",
    styles:JSON.parse(mapStyle)

  });


console.log(JSON.parse(mapStyle));
  marker = new google.maps.Marker(
    {
      position : {lat: 0, lng: 0}
    });


    marker.addListener('click', function() {
      map.setZoom(15);
      map.setCenter(marker.getPosition());
      var lat = marker.getPosition().lat();
      var lng = marker.getPosition().lng();
      route(lat,lng);
    });

    //navigator.geolocation.getCurrentPosition(succes_gps,error_gps);

  }

  function requests(){
    get('deliveries',addDeliveriesMarkers);
    get('customers',console.log);
    get('customers/1',displayDeliveries);
    get('drivers',console.log);
    get('drivers/1',console.log);
  }




  // works on ANDROID
  // Ouvre l'appli native et affiche l'itinéraire :
  //  - origine = position actuelle
  // - destination = coordonnées passées
  function route(lat,lng){
    window.open("google.navigation:q="+lat+","+lng+"&mode=d" , '_system');
  }

  /*
  ** Function which make an AJAX request to get data from the server
  ** @param url : data to get (ex : deliveries, customers...)
  ** @param succes : succes callback executed
  */
  function get(url, succes){
    $.ajax({
      url: 'https://dev-deliverbag.supconception.fr/'+url,
      dataType: 'jsonp',
      success: function(data){
        succes(JSON.parse(data));
      },
      error:function(e){
        console.log(e);
      },
    });
  }


  function post(url, succes, data){
    $.ajax({
      url: 'http://dev-deliverbag.supconception.fr/'+url,
      type : 'POST',
      data : data,
      success: function(data){
        succes(JSON.parse(data));
      },
      error:function(e){
        console.log(e);
      },
    });
  }

  /*
  ** Display customer's deliveries
  ** @param data : deliveries from a specific customer
  */
  function displayDeliveries(data){
    for (var i=0; i<data[0].deliveries.length; i++){
      console.log(data[0].deliveries[i]);
    }

  }
  /*
  ** Add deliveries markers on the map
  ** @param data : deliveries from AJAX call
  */
  function addDeliveriesMarkers(data){

    for (var i=0; i<data.length; i++){
      var infoW = new google.maps.InfoWindow({
        content: ` <div id="delivery_infos"> ${data[i].name} <br> ${data[i].comment} </div>`
      });

      var marker_start = new google.maps.Marker(
        {
          position : {
            lat: data[i].start_position.lat,
            lng: data[i].start_position.lng
          }
        });

        marker_start.setMap(map);

        var marker_end = new google.maps.Marker(
          {
            position : {
              lat: data[i].end_position.lat ,
              lng: data[i].end_position.lng
            }
          });

          marker_start.addListener('click', function() {
            infoW.open(map, marker_start);
            marker_end.setMap(map);


            /*
            $('#delivery_infos').html(`<p> ${data[i].name} </p>
            <p> ${data[i].comment} </p> <p> TEST </p>
            `);
            $('#delivery_infos').html("efjfejfe");
            */
            //  $('#delivery_infos').toggle();
          });

          infoW.addListener('closeclick', function() {
            marker_end.setMap(null);
          });
        }
      }


      /*
      ** Display the map, center on the user_pos and initialize user_pos refresh timer
      */
      function displayMap(){
        window.timer = setInterval(function() {
          navigator.geolocation.getCurrentPosition(succes_gps,error_gps,{timeout:2000})},2000);
          //navigator.geolocation.watchPosition(succes_gps,error_gps,{timeout:5000});
          map.setCenter(user_pos);
          $('#map').css('display','block');
        }

        /*
        ** Hide the map & stop the timer
        */
        function hideMap(){

          $('#map').css('display','none');
          clearInterval(window.timer);

        }


        function button_webview(){
          webview('https://dev-deliverbag.supconception.fr/');
        }

        function webview(url){
          window.open('https://dev-deliverbag.supconception.fr/', '_self', 'location=no,zoom=no');
        }


        function test_firebase(){
          /*
          window.FirebasePlugin.getToken(function(token) {
          // save this server-side and use it to push notifications to this device
          $('.token').val(token);
        }, function(error) {
        alert(error);
      });
      */
      window.FirebasePlugin.verifyPhoneNumber('0777706645', 60, function(credential) {
        alert(credential);
      });


      // POUR CHANGER DE PAGE
      //window.location = "test.html";

    }
