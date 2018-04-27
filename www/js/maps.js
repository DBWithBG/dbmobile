var map,marker;
var serv = 'http://dev-deliverbag.supconception.fr/';


document.addEventListener('deviceready', function () {

  var today =  new Date().toISOString().split('T')[0] ;
  $('#date').attr('min',today);
  checkGps();
  requests();
});



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
    gestureHandling: "greedy"

  });


  marker = new google.maps.Marker(
    {
      position : {lat: 0, lng: 0}
    });


    marker.addListener('click', function() {
      map.setZoom(16);
      map.setCenter(marker.getPosition());
      var lat = marker.getPosition().lat();
      var lng = marker.getPosition().lng();
      route(lat,lng);
    });

    //navigator.geolocation.getCurrentPosition(succes_gps,error_gps);

  }

  function requests(){
    request('deliveries',addDeliveriesMarkers);
    request('customers',console.log);
    request('customers/1',displayDeliveries);
    request('drivers',console.log);
    request('drivers/1',console.log);
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
  function request(url, succes){
    $.ajax({
      url: 'http://dev-deliverbag.supconception.fr/'+url,
      dataType: 'jsonp',
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
          //clearInterval(window.timer);
          $('#map').css('display','none');
          clearInterval(window.timer);
          window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            alert(token);
          }, function(error) {
            alert(error);
          });
        }


        function firebase(){

          window.FirebasePlugin.getToken(function(token) {
            // save this server-side and use it to push notifications to this device
            console.log(token);
          }, function(error) {
            console.error(error);
          });
          // POUR CHANGER DE PAGE
          //window.location = "test.html";

        }
