var user_pos,start_pos,end_pos;


$(function(){ // this will be called when the DOM is ready
  $('#input_train').on('input paste', function() {
    var val = $('#input_train').val();
    var dateVoyage = $('#date').val();
  //  since=20170407T120000&until=20170407T120100
  dateVoyage = (dateVoyage.split('-').join('')) + "T000000";
  if (dateVoyage != ''){
    $.get(`https://api.sncf.com/v1/coverage/sncf/vehicle_journeys/?headsign=${val}&since=${dateVoyage}&key=7308cd76-a20f-4f01-9cc3-59d4742bba24 `, function(data){
      traitement_gares(data);
    });
  }
    else{
      alert("Vous devez spécifier une date de voyage");
    }
  });
});
function requestSNCF(){
  /*
  ${domain}api/records/1.0/search/?dataset=tgvmax&refine.destination=BORDEAUX+ST+JEAN&refine.train_no=${num_train} `, {


  if (data.records.length < 1) {
  alert("Numéro de train incorrect");
}
else{
console.log("L'heure d'arrivée de ce train est prévue à " + data.records[0].fields.heure_arrivee);
}

*/
// 6171 retards
//var train = 6196;

var train = $('#input_train').val();
var domain = `https://data.sncf.com/`;
var key = '7308cd76-a20f-4f01-9cc3-59d4742bba24';


var gare = 'OCE:SA:87581009';
var dateVoyage = $('#date').val();

console.log(dateVoyage);
console.log(new Date(dateVoyage));


$.get(`https://api.sncf.com/v1/coverage/sncf/disruptions/?headsign=${train}?since=''&until=''&key=7308cd76-a20f-4f01-9cc3-59d4742bba24 `, function(data){
  traitement_retard(data.disruptions);
});

// ON PEUT CHANGER QUELS TRAINS SONT VISIBLES (date)


/*
$.get(`https://api.sncf.com/v1/coverage/sncf/stop_areas/stop_area:${gare}/arrivals/?count=200&key=7308cd76-a20f-4f01-9cc3-59d4742bba24 `, function(data){
traitement_gares(data)
});
*/





}

function traitement_gares(data){
  $('.choix_gare').remove();
  var stops = data.vehicle_journeys[0].stop_times;
  for (var i=0 ;i<stops.length; i++){
    var pos = {  lat : parseFloat(stops[i].stop_point.coord.lat), lng : parseFloat(stops[i].stop_point.coord.lon) } ;
    $(`<br> <button class="choix_gare" data-lat="${pos.lat}" data-lng="${pos.lng}"> ${stops[i].stop_point.name} </button>`).insertAfter($('#input_train'));
    console.log(stops[i].stop_point.name);
    console.log('*************');
  }
  $('.choix_gare').click(function(){
    var lat = $(this).data("lat");
    var lng = $(this).data("lng");
    var pos = {lat : lat, lng : lng};
    geocode(pos);
  });
}

function traitement_retard(data){
  var stops = data[0].impacted_objects[0].impacted_stops;
  for(var i=0 ;i<stops.length;i++ ){

    var new_hour = (stops[i].amended_arrival_time).substring(0,2);
    var new_min = (stops[i].amended_arrival_time).substring(2,4);
    var new_sec = (stops[i].amended_arrival_time).substring(4,6);
    var old_hour = (stops[i].base_arrival_time).substring(0,2);
    var old_min = (stops[i].base_arrival_time).substring(2,4);
    var old_sec = (stops[i].base_arrival_time).substring(4,6);
    if ( (new_hour != old_hour) || (new_min != old_min)) {
      alert(stops[i].stop_point.name);
      alert(`Le train arrivera à ${new_hour}:${new_min}:${new_sec} au lieu de ${old_hour}:${old_min}:${old_sec}`) ;
      console.log("----------------------------------------");
    }
  }
}

function traitement(data){
  console.log(data);
  var numero_train;
  var found=false;

  for(var i=0; i<data.arrivals.length; i++){

    numero_train = data.arrivals[i].display_informations.headsign;
    if (numero_train==$('#input_tain').val()){
      found=true;
      console.log("Le " + data.arrivals[i].display_informations.commercial_mode +" numéro " + numero_train + " a pour destination " + data.arrivals[i].display_informations.direction);
      var str_date = data.arrivals[i].stop_date_time.arrival_date_time ;
      var year  = str_date.substring(0,4);
      var month = str_date.substring(4,6);
      var day = str_date.substring(6,8);
      var hour = str_date.substring(9,11);
      var min = str_date.substring(11,13);
      var sec = str_date.substring(13,15);
      var date = new Date(year+"-"+month+"-"+day+"T"+hour+":"+min+":"+sec).toLocaleString();
      console.log("Il sera en gare le " + date );
      console.log("-------------------------------------");
    }
  }
  if (!found){
    alert("Votre train n'a pas été trouvé. Vérifiez que le numéro de train rentré est correct");
  }
}

/*

var pr = $.ajax('https://api.sncf.com/v1/coverage/sncf/disruptions//?since=20170725T103406& ', {
type:'GET',
dataType:'json',
});

pr.done(function(pr){

alert(pr);

if (pr.records.length < 1) {
alert("Numéro de train incorrect");
}
else{
console.log("L'heure d'arrivée de ce train est prévue à " + pr.records[0].fields.heure_arrivee);
}
});
*/






/*
** Verify that the input place is in the service étrange
** Actually fixed on '33' , Gironde
** @param place : place objet that contains adresse & geolocation informations
*/
function verifyDepartment(place){
  //var bdx_metropole = {33130, 33370 ,33110,33170,33700,33185,33530,33127,33400,33810,33290,33150,33520,33160,33310,33440,33270,33140,33560,33600,33320,33800,33100,33000,33200,33300};
  var res = place.address_components;
  var found = false;
  var gironde = '33'
  for (var i = 0; i < res.length; i++) {
    for (var j = 0; j < res[i].types.length; j++) {
      if (res[i].types[j] == "postal_code") {
        found = true;
        // We use FOUND to know if there is a postal code for the place
        // For exemple, there is no postal code for Paris
        var dep = res[i].long_name;
        if (dep.substr(0,2) !== gironde){
          //  two first numbers are taken to verify the department
          alert("Le service n’est pour le moment disponible qu’en Gironde (33).");
        }
      }
    }
  }
  if (!found){
    alert("Le service n’est pour le moment disponible qu’en Gironde (33).");
  }
}
/*
** geocode is used to transform a latLng objet into a Place objet
** usefull in case of user_pos
** the function also calls verifyDepartment after the objet's conversion
** @param pos : pos objet that contains latLng
*/
function geocode(pos){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'latLng': pos},
    function(results,status){
      // c'est un appel asynchrone donc on doit vérifier que le retour est correct
      if (status !== google.maps.GeocoderStatus.OK) {
        alert("Erreur lors de l'appel a geocode");
      }
      if (status == google.maps.GeocoderStatus.OK) {
        verifyDepartment(results[1]);
      }
    });
  }


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
  ** turn on Google Maps autocomplete in input fields
  **
  */
  function activateAutocomplete(){

    // restrictions
    var france = {
      country: 'fr'
    }

    var start = document.getElementById('lieu_depart');
    // jQuery don't work here, weird
    var end = document.getElementById('lieu_arrivee');
    var options = {
      types : ['address'],
      componentRestrictions: france
      // Si on veut mettre des restrictions c'est ici !
    };

    var autocomplete_start = new google.maps.places.Autocomplete(start, options);
    var autocomplete_end = new google.maps.places.Autocomplete(end, options);


    $('#input_user').click(function() {

      if (this.checked) {
        navigator.geolocation.getCurrentPosition(function(position){
          user_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          start_pos=user_pos;
          geocode(start_pos);
        }, error_gps);
        $("#lieu_depart").prop("type", "hidden");
      }else{
        $("#lieu_depart").prop("type", "text");
      }
    });

    autocomplete_start.addListener('place_changed', function() {
      if (this.getPlace().geometry.location){
        start_pos = this.getPlace().geometry.location;
        verifyDepartment(this.getPlace());
      }
    });

    autocomplete_end.addListener('place_changed', function() {
      end_pos = this.getPlace().geometry.location;
      verifyDepartment(this.getPlace());
    });


  }

  function calendar(){

    var options = {
      date: new Date(),
      mode: 'date',
      minDate : new Date().valueOf(),
      allowOldDates: false, // FOR IOS
      allowFutureDates: true, // FOR IOS
      androidTheme: datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK , // ID for the material design theme datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
      is24Hour : true
    };
    datePicker.show(
      options,
      function(date){
        alert(data.toJSON());},
        function(error){
          alert(error);
        });
      }
