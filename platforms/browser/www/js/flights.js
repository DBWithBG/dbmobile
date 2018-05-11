var app_id = '95a4eb71';
var app_key = '84cb52736b8c4db53b753b8f87be34a8';




function flightStats(){

  var vol = $('#input_flight').val();
  var airport = $('#input_airport').val();
  var dateVoyage = $('#date').val();

  var compagny = vol.substring(0,2);
  var flight_number = vol.substring(2,6);
  var year = dateVoyage.substring(0,4);
  var month = dateVoyage.substring(5,7);
  var day = dateVoyage.substring(8,10);


  if (vol && dateVoyage){
    //$.get(`https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/${compagny}/${flight_number}/arr/${year}/${month}/${day}?appId=${app_id}&appKey=${app_key}&utc=false`, function(data){
    //  console.log(data);
/*
* 3 letters code can be annoying for user
* there is no need, destination can be checked by a comparaison with an array of destination (from the database)
*/
      $.ajax({
        url: `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/${compagny}/${flight_number}/arr/${year}/${month}/${day}?appId=${app_id}&appKey=${app_key}&utc=false`,
        dataType: 'jsonp',
        success: function(data){
          var res = data.flightStatuses[0];
          //var dateRunway = new Date(res.operationalTimes.estimatedRunwayArrival.dateLocal) ; //NOT ALWAYS DFINED !!!!!
          var dateGate = new Date(res.operationalTimes.scheduledGateArrival.dateLocal) ;
          if (res.operationalTimes.estimatedGateArrival){
           dateGate = new Date(res.operationalTimes.estimatedGateArrival.dateLocal) ; //RUNWAY OR GATE
          }

        /* var minRunway = dateRunway.getMinutes();
          if (minRunway<10){
            minRunway='0'+minRunway;
          }
          */
          console.log(data);
          var minGate = dateGate.getMinutes();
          if (minGate<10){
            minGate='0'+minGate;
          }
          var departure_airport = res.departureAirportFsCode;
          var arrival_airport = res.arrivalAirportFsCode;
          var arrivee,city;
            data.appendix.airports.forEach( function(element){
              if (element.fs == arrival_airport){
                console.log(element);
                 arrivee = element.name ;
                 city = element.city ;
              }
            });



          if (res.delays){
            var delay = res.delays.arrivalGateDelayMinutes ;
            if (delay){
              console.log(`Il y'a un retard de ${delay} minute(s) sur ce vol.`);
            }
          }
          console.log(`Le client sera à la sortie de ${arrivee} (${city}) le ${dateGate.getDate()}/${dateGate.getMonth()+1}/${dateGate.getFullYear()} à ${dateGate.getHours()}h${minGate}`);
        //  console.log(`Le client sera à la porte à ${dateGate.getHours()}h${minGate}`);
          },
        error:function(e){
          console.log(e);
        }
      });
  }
  else{
    if (!vol){
      console.log("Vous devez spécifier un numéro de vol");
    }
    if (!airport){
      console.log("Vous devez spécifier un aéroport d'arrivée (code à 3 chiffres)");
    }
    if (!dateVoyage){
      console.log("Vous devez spécifier une date de voyage");
    }
  }

}
