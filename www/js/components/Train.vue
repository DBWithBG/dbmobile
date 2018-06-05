<template>
  <div id="home">
    <demand-header> </demand-header>
    Train component
    <alert v-if="error.length" :message="error"> </alert>
    <datetime v-model="date" placeholder="Entrez la date" type="date" moment-locale="fr" max-date="2018-07-01">
    </datetime>
    <div  v-if="date !== '' "> </br>
      <!--
      <alert v-if="errorNumTrain" message="Le numéro de train rentré semble incorrect"> </alert>
    -->
    <input v-model="numTrain" v-on:input="traitementTrain" v-on:click="resetData" pattern="\d*" maxlength="4" class="input-1" type="number" :placeholder="label">
    <!-- ALERT BOX
    <div v-if="errors[gare]"class="col-md-12 nopadding">
    <div class="alert-box warning">
    <span class="alert-closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
    <strong><i class="fa fa-exclamation" aria-hidden="true"></i> &nbsp;    !</strong> &nbsp;Cet endroit n'est pas encore pris en charge par nos servies.
  </div>
</div>

<alert v-if="errorGare" message="Cet lieu n'est pas encore desservi par nos services"> </alert>
-->
<div v-if="numTrain.length==4 " >
  <ul>
    <li v-for="item in gares">
      <button v-on:click="isInGironde(item)" class="btn btn-medium border border-green uppercase xround-2 " > {{item.name}} </button>
    </li>
  </ul>
</div>
</div>
</div>
</template>

<script>


import Alert from './Alert.vue'
import {Datetime} from 'vue-datetime';
import Menu from './Menu.vue';
import DemandHeader from './DemandHeader.vue';

export default {
  components : {
    'datetime' : Datetime,
    'alert' : Alert,
    'db-menu' : Menu,
    'demand-header':DemandHeader
  },
  data(){
    return {
      date:'' ,
      numTrain :'',
      gares:[],
      error:'',
      label:'Indiquez votre numéro de train',
      key:'7308cd76-a20f-4f01-9cc3-59d4742bba24'
    }
  },

  computed:{
  },

  methods:{

    input(){
      alert('input event');
    },
    debug(data){
      alert(data);
    },

    minDate(){
      return (new Date().toISOString().substring(0,10));
    },

    maxDate(){

    },

    // on réinitialise les erreurs et les données
    resetData(){
      this.gares=[];
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
          this.error="Ce lieu n'est pas encore desservi par nos services";
          //console.log(this.errors);
        }
      },

      traitementTrain(){
        var self=this;
        // on réinitalise les gares correspondant à un autre numéro de train
        //this.gares=[];
        // on réinitialise les erreurs potentielles
        //this.errorGare=false;
        //this.errorNumTrain=false;

        if (this.numTrain.length==4){
          var dateTrain =( (this.date.split('T'))[0] + "T000000" );
          console.log(dateTrain);
          $.get(`https://api.sncf.com/v1/coverage/sncf/vehicle_journeys/?headsign=${this.numTrain}&since=${dateTrain}&key=${this.key} `, function(data)
          {
            console.log(data);
            self.traitement_gares(data);
          })
          .fail(function(error) {
            switch(error.status){
              case 404 : self.error="Ce numéro de train ne correspond à aucun train circulant à cette date";
              break;
              default: self.error="Une erreur inconnue est survenue lors de la recherche de ce train";
            }

          });
        }
      },

      traitement_gares(data){

        var stops = data.vehicle_journeys[0].stop_times;
        for (var i=1 ;i<stops.length; i++){
          var pos = {  lat : parseFloat(stops[i].stop_point.coord.lat), lng : parseFloat(stops[i].stop_point.coord.lon) } ;
          //  $(`<br> <button  class="btn btn-medium border border-green uppercase xround-2 choix_gare" data-lat="${pos.lat}" data-lng="${pos.lng}"> ${stops[i].stop_point.name}  </button>`).insertAfter($('#input_train'));
          console.log(stops[i].stop_point.name);
          console.log('*************');
          this.gares.push(stops[i].stop_point);
          console.log(this.gares);
        }
      },

      isInGironde(gare){
        // Geocode recçoit des coordonées sous forme de nombre et non de Strings
        var lat = parseFloat(gare.coord.lat);
        var lng =  parseFloat(gare.coord.lon);
        var pos = {lat : lat, lng : lng};
        //var pos = JSON.stringify(gare.coord);
        this.geocode(pos);

      }

      /*
      $('.choix_gare').click(function(){
      var lat = $(this).data("lat");
      var lng = $(this).data("lng");
      var pos = {lat : lat, lng : lng};
      geocode(pos);
    });
  }
  */
}
}
</script>



<style scoped>


</style>
