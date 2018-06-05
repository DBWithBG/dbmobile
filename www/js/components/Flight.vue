<template>
  <div>
    <demand-header> </demand-header>
    Flight component
    <alert v-if="error.length" :message="error"> </alert>
    <datetime v-model="date" placeholder="Entrez la date" type="date" moment-locale="fr"  max-date="2018-07-01">
    </datetime>
    <div  v-if="date !== '' ">
      <input v-model="numVol" v-on:input="traitementVol" v-on:click="resetData" class="input-1" type="text"  maxlength="6" :placeholder="label">

    </div>
  </div>
</template>

<script>


import {Datetime} from 'vue-datetime';
import Alert from './Alert.vue';
import Menu from './Menu.vue';
import DemandHeader from './DemandHeader.vue';

export default {
  components : {
    'datetime' : Datetime,
    'alert' : Alert,
    'db-menu' : Menu,
    'demand-header':DemandHeader


  },

  data() {
    return {
      date:'',
      error:'',
      app_id : '95a4eb71',
      app_key : '84cb52736b8c4db53b753b8f87be34a8',
      numVol : '',
      label : 'Entrez votre numéro de vol'
    }
  },
  methods:{

    minDate(){
      return (new Date().toISOString().substring(0,10));
    },

    maxDate(){

    },

    traitementVol(){

      var self=this;
      var year = this.date.substring(0,4);
      var month = this.date.substring(5,7);
      var day = this.date.substring(8,10);

      if (this.numVol.length==6){

        $.ajax({
          url: `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/${this.compagnyId}/${this.flightId}/arr/${year}/${month}/${day}?appId=${this.app_id}&appKey=${this.app_key}&utc=false`,
          dataType: 'jsonp',
          success: function(data){
            console.log(data);
            if (!data.flightStatuses.length){
              self.error="Ce numéro de vol ne correspond à aucun vol à cette date";
            }
            else{
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

                self.isInGironde(element);
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
          }
        },
        error:function(e){
          self.error="Une erreur inconnue est survenue lors de la recherche de ce vol";
          console.log(e);
        }
      });
    }
  },

  // on réinitialise les erreurs et les données
  resetData(){
    this.numVol='';
    this.error='';
  },


  /*
  ** geocode is used to transform a latLng objet into a Place objet
  ** usefull in case of user_pos
  ** the function also calls verifyDepartment after the objet's conversion
  ** @param pos : pos objet that contains latLng
  */

  geocode(pos){
    var self=this;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'latLng': pos},
      function(results,status){
        // c'est un appel asynchrone donc on doit vérifier que le retour est correct
        if (status !== google.maps.GeocoderStatus.OK) {
          alert("Erreur lors de l'appel a geocode");
          console.log(status);
        }
        if (status == google.maps.GeocoderStatus.OK) {
          self.verifyDepartment(results[1]);
        }
      });
    },

    /*
    ** Verify that the input place is in the service étrange
    ** Actually fixed on '33' , Gironde
    ** @param place : place objet that contains adresse & geolocation informations
    */


    verifyDepartment(place){

      //var bdx_metropole = {33130, 33370 ,33110,33170,33700,33185,33530,33127,33400,33810,33290,33150,33520,33160,33310,33440,33270,33140,33560,33600,33320,33800,33100,33000,33200,33300};
      var res = place.address_components;
      var found = false;
      var isGironde = false;
      var gironde = '33'
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].types.length; j++) {
          if (res[i].types[j] == "postal_code") {
            found = true;
            // We use FOUND to know if there is a postal code for the place
            // For exemple, there is no postal code for Paris
            var dep = res[i].long_name;
            if (dep.substr(0,2) == gironde){
              isGironde=true;
              //  two first .numbers are taken to verify the department
            }
          }
        }
      }
      if (isGironde){
        // on redirige l'utilisateur sur la page suivante
        this.$router.push( { name:'demand-next', params : {date : this.date, place : place} });
      }
      else{
        //console.log(this.$router);
        //this.$router.replace(this.$router.history.current.path);
        // on met une alerte pour lui dire que la gare sélectionnée n'est pas encore desservie
        this.error="Cet aéroport n'est pas encore desservi par nos services";
        //console.log(this.errors);
      }
    },

    isInGironde(airport){
      // Geocode recçoit des coordonées sous forme de nombre et non de Strings
      var lat = parseFloat(airport.latitude);
      var lng =  parseFloat(airport.longitude);
      var pos = {lat : lat, lng : lng};
      //var pos = JSON.stringify(gare.coord);
      this.geocode(pos);

    }

},

computed:{
  compagnyId(){
    return this.numVol.substring(0,2);

  },
  flightId(){
    return this.numVol.substring(2,6);
  }
}
}
</script>

<style scoped>

</style>
