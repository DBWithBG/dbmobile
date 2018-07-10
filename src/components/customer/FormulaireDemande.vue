<template>
  <div id="home">
    <back-header :message="$t('header')"> </back-header>

    <!-- STEPPER -->
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1" > {{$t('subt_1')}}</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">{{$t('subt_2')}}</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step step="3">{{$t('subt_3')}}</v-stepper-step>
      </v-stepper-header>


      <v-stepper-items>
        <!-- PRISE EN CHARGE -->
        <v-stepper-content step="1">
          <v-subheader color="primary"> {{$t('subt_1')}}</v-subheader>
          <v-layout row>
            <v-flex mt-2 mb-2 xs12 sm6 offset-sm3>
              <span class="subheading" >{{$t('info_1')}}</span>
            </v-flex>
          </v-layout>

          <!-- MESSAGES D'ERREURS -->
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <div v-if="error.length">
                <alert :message="error"> </alert>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <div v-for="error in errors">
                <alert v-if="error !='' " :message="error"> </alert>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs10 >
              <!-- DATE PICKER -->
              <v-menu ref="menudate" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date" transition="scale-transition" offset-y full-width min-width="290px">
                <v-text-field
                slot="activator" v-model="displayDate" v-bind:label="$t('label_date')" prepend-icon="event" readonly>
              </v-text-field>


              <v-date-picker v-model="date" :min="minDate" @input="$refs.menudate.save(date)" color="primary" no-title scrollable :locale="this.$root.$i18n.locale" >

              </v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex xs2>
          </v-flex>
          <!-- TIME PICKER POUR ADRESSE -->
          <div v-if="type == 'address'">
            <v-flex xs10>
              <!-- DATE PICKER -->
              <v-menu ref="menutime" :close-on-content-click="false" :nudge-right="40" :return-value.sync="time" transition="scale-transition" offset-y lazy full-width min-width="290px">
                <v-text-field
                slot="activator" v-model="displayTime" v-bind:label="$t('label_heure')" append-icon="access_time"  readonly>
              </v-text-field>
              <v-time-picker v-model="time" :min="minTime" :format="$t('date_format')" @change="$refs.menutime.save(time)" color="primary" no-title :locale="this.$root.$i18n.locale" > </v-time-picker>
          </v-menu>
        </v-flex>
      </div>
    </v-layout>


    <v-layout v-if="type == 'train'" >
      <v-flex row xs6 offset-xs3>
        <!-- NUMERO DE TRAIN POUR TRAIN -->
        <v-text-field v-model="numTrain" v-on:input="traitementTrain" v-on:click="resetData" pattern="\d*" type="number" :placeholder="$t('train_number')">
        </v-text-field>
      </v-flex>
    </v-layout>

      <!-- SELECTION DE L'ARRET EN GARE POUR TRAIN -->
      <v-layout row>
      <v-flex v-if="gares.length" xs12>
        <v-select
        :items="gares"
        v-model="selectedGare"
        item-text="stop_point.name"
        v-bind:label="$t('select_gare')"
        single-line
        v-on:input="verifGare"
        ></v-select>
      </v-flex>
      </v-layout>


    <!-- NUMERO DE VOL POUR VOL -->
    <v-layout v-if="type == 'flight'" row>
      <v-flex xs12 sm6 offset-sm3>
        <input v-model="numVol" v-on:input="traitementVol" v-on:click="resetData" type="text"  maxlength="6" :placeholder="$t('flight_number')">
      </v-flex>
    </v-layout>

    <!-- ADRESSE DE PRISE EN CHARGE POUR ADRESSE -->
    <v-layout v-if="type == 'address'" row>
      <v-flex xs12 sm6 offset-sm3>
        <input class="autocomplete" ref="autocomplete_start" v-bind:placeholder="$t('label_address_depart')"/>
      </v-flex>
    </v-layout>


    <!-- INFORMATIONS DE LIVRAISON ET TYPE DE PRESTATION -->
    <v-layout row>
      <v-flex mt-4 mb-3 xs12 sm6 offset-sm3>
        <span class="subheading" >{{$t('info_2')}}</span>
      </v-flex>
    </v-layout>


    <!-- ADRESSE DE LIVRAISON POUR TOUS LES CAS -->
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <input class="autocomplete" ref="autocomplete_end" v-bind:placeholder="$t('label_address_livraison')" />
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex mt-4 mb-2 xs12 sm6 offset-sm3>
        <v-switch v-bind:label="$t('livraison')" v-model="livraisonDirecte" color="success"> </v-switch>
      </v-flex>
    </v-layout>





    <v-layout v-if="!livraisonDirecte" row>
      <v-flex xs10 >
        <!-- DATE PICKER SI CONSIGNE -->
        <v-menu ref="menudateend" :close-on-content-click="false" :nudge-right="40" :return-value.sync="dateEnd" transition="scale-transition" offset-y full-width min-width="290px">
          <v-text-field
          slot="activator" v-model="displayDateEnd" v-bind:label="$t('label_date')" prepend-icon="event" readonly>
        </v-text-field>


        <v-date-picker v-model="dateEnd" :min="minDateEnd" :max="maxDateEnd" @input="$refs.menudateend.save(dateEnd)" color="primary" no-title scrollable :locale="this.$root.$i18n.locale" >

        </v-date-picker>
      </v-menu>
    </v-flex>
    <v-flex xs2>
    </v-flex>
    <!-- TIME PICKER SI CONSIGNE -->
      <v-flex xs10>
        <!-- DATE PICKER -->
        <v-menu ref="menutimeend" :close-on-content-click="false" :nudge-right="40" :return-value.sync="timeEnd" transition="scale-transition" offset-y lazy full-width min-width="290px">
          <v-text-field
          slot="activator" v-model="displayTimeEnd" v-bind:label="$t('label_heure')" append-icon="access_time"  readonly>
        </v-text-field>


        <v-time-picker v-model="timeEnd" :min="minTimeEnd" :max="maxTimeEnd"
        :format="$t('date_format')"
        @change="$refs.menutimeend.save(timeEnd)"
        color="primary"
        no-title
        :locale="this.$root.$i18n.locale" >

      </v-time-picker>
    </v-menu>
  </v-flex>
</v-layout>




<v-flex xs12 sm6 offset-sm3 >
  <v-btn :disabled="!isFormOk()" color="primary" @click.native="step=2"dark >
    <span> {{$t('next')}}</span>
    <v-icon right>navigate_next</v-icon>
  </v-btn>

</v-flex>
<!--  this.$router.push( { name:'demand-next', params : {date : this.date, place : this.place} });

-->

</v-stepper-content>







<v-stepper-content step="2">
  Mes bagages

  <!-- Gestion des bagages -->



  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>

      <v-btn color="primary" @click.native="ajoutBagage('cabine')" dark > {{$t('bagages_ajout')}} {{$t('bagage_cabine')}}</v-btn>
      <div v-for="bag in bagagesCabine" :key="bag.id">

        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesCabine, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn icon flat color="teal" >
              <v-icon>photo</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            ></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider>
        </v-divider>
      </div>
    </v-flex>
  </v-layout>


  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-btn  color="primary" @click.native="ajoutBagage('soute')" dark >{{$t('bagages_ajout')}} {{$t('bagage_soute')}} </v-btn>
      <div v-for="bag in bagagesSoute" :key="bag.id">
        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesSoute, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn icon flat color="teal" >
              <v-icon>photo</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            ></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider>
        </v-divider>
      </div>
    </v-flex>
  </v-layout>

  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-btn  color="primary" @click.native="ajoutBagage('autre')" dark >{{$t('bagages_ajout')}} {{$t('bagage_autre')}}</v-btn>
      <div v-for="bag in bagagesAutre" :key="bag.id">

        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesAutre, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
            <v-btn icon flat color="teal" >
              <v-icon>photo</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  required box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            :rules="[() => bag.name.length > 0 || $t('bagage_required')]"
            ></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>
        <v-divider>
        </v-divider>
      </div>
    </v-flex>
  </v-layout>



  <v-layout row>


    <v-flex xs4>
      <v-btn color="orange lighten-1" @click.native="step=1" dark >
        <v-icon>navigate_before</v-icon>
        {{$t('prev')}}
      </v-btn>
    </v-flex>
    <v-flex xs2>
    </v-flex>
    <v-flex xs5>
      <v-btn :disabled="!verifBagage()" color="action" @click.native="step=3" dark >
        {{$t('next')}}
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-flex>

  </v-layout>

</v-stepper-content>

<v-stepper-content step="3">

  <v-card>
    {{reponse()}}
  </v-card>


  <v-btn  color="orange lighten-1" @click.native="step=2" dark >{{$t('prev')}}</v-btn>
  <v-btn  color="action" @click.native="payer()" dark >{{$t('payer')}} </v-btn>
</v-stepper-content>
</v-stepper-items>

</v-stepper>

</div>

</template>

<script>



export default {

  props:['type'],

  data(){
    return {

      activeDeliveryId:'',
      step:0,
      livraisonDirecte:false,
      message:'',
      slider:0,
      ticks:['Aujourd\'hui', 'Demain'],
      minDate:new Date().toISOString().substring(0,10),
      date:new Date().toJSON(),
      time:new Date(),
      dateEnd:new Date().toJSON(),
      timeEnd:new Date(),

      startPlace:'',
      endPlace:'',
      error:'',
      errors:{},
      authorized:[],
      sncf_key:'7308cd76-a20f-4f01-9cc3-59d4742bba24',
      numTrain :'',
      gares:[],
      selectedGare:'',

      flight_app_id : '95a4eb71',
      flight_app_key : '84cb52736b8c4db53b753b8f87be34a8',
      numVol : '',

      bagagesCabine : [],
      bagagesSoute : [],
      bagagesAutre : []
    }
  },

  computed:{
    compagnyId(){
      return this.numVol.substring(0,2);
    },
    flightId(){
      return this.numVol.substring(2,6);
    },
    dateFormated(){
      if (this.date != null)
      return this.date.getMonth();
    },



    minDateEnd(){
     return new Date(this.date).toISOString().substring(0,10);
    },

    maxDateEnd(){
     return new Date(this.date).toISOString().substring(0,10);
    },

    minTimeEnd(){
      return this.time.toLocaleString().substring(12,18) ;
    },

    maxTimeEnd(){
      return this.time.toLocaleString().substring(12,18) ;
    },

    //return this.moment(this.date).add(1,'day').format('L');
   //  return this.moment(this.time).add(24,'hours').format('LT');

    dateTime(){
      //console.log(this.time);
      let date = new Date(this.date);
      if (typeof this.time === 'string'){
        date.setHours(this.time.match(/^(\d+)/)[1]);
        date.setMinutes(this.time.match(/:(\d+)/)[1]);
      }
      else{
        date.setHours(this.time.getHours());
        date.setMinutes(this.time.getMinutes());
      }
      return date.toLocaleString();
    },

    dateTimeEnd(){
      //console.log(this.time);
      let date = new Date(this.dateEnd);
      if (typeof this.timeEnd === 'string'){
        date.setHours(this.timeEnd.match(/^(\d+)/)[1]);
        date.setMinutes(this.timeEnd.match(/:(\d+)/)[1]);
      }
      else{
        date.setHours(this.timeEnd.getHours());
        date.setMinutes(this.timeEnd.getMinutes());
      }
      return date.toLocaleString();
    },

    minTime(){
      let time;
      if (this.dateTime.substring(0,10) != new Date().toLocaleString().substring(0,10)) {
        time = '';
      }
      else{
        time = new Date().toLocaleString().substring(12,18);
      }
      return time;
    },

    maxDateTime(){
      var date = new Date(this.dateToJson);
      date.setDate(date.getDate() + 1);
      return date.toLocaleString().substring(0,18)
    },

    maxDate(){
      return this.maxDateTime.substring(0,10);
    },

    maxTime(){
      return this.maxDateTime.substring(12,18);
    },

    dateToJson(){
      console.log(this.time);
      var date = new Date(this.date);
      if (typeof this.time === 'string'){
        date.setHours(this.time.match(/^(\d+)/)[1]);
        date.setMinutes(this.time.match(/:(\d+)/)[1]);
      }
      else{
        date.setHours(this.time.getHours());
        date.setMinutes(this.time.getMinutes());
      }
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds())).toJSON().split('.')[0].replace('T',' ');
    },

    displayDate(){
      return this.dateTime.substring(0,10);
    },

    displayTime(){
      return this.dateTime.substring(12,18);
    },

    displayDateEnd(){
      return this.dateTimeEnd.substring(0,10);
    },

    displayTimeEnd(){
      return this.dateTimeEnd.substring(12,18);
    }

  },


  methods : {

    reponse(){

      if (this.step==3) {

        //alert(typeof(this.startPlace.geometry.location));
        var req =
        {
          "start_position":
          {
            "name": this.startPlace.name,
            "address":this.startPlace.formatted_address,
            "lat" :this.startPlace.geometry.location.lat(),
            "lng":this.startPlace.geometry.location.lng()
          }
          ,
          "end_position":
          {
            "name": this.endPlace.name,
            "address":this.endPlace.formatted_address,
            "lat" :this.endPlace.geometry.location.lat(),
            "lng":this.endPlace.geometry.location.lng()
          }
          ,
          "delivery" :
          {
            "comment" : "Un commentaire... sur une demande de prise en charge...",
            "start_date" : this.dateToJson,
            "livraisonDirecte":this.livraisonDirecte
          },
          "bagages" : {
            '1' : this.bagagesCabine,
            '2' : this.bagagesSoute,
            '3' : this.bagagesAutre
          },
          "mobile_token":localStorage.getItem('deviceId'),

        }
        var self=this;

        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/create/delivery',
          type : 'POST',
          data : req,
          success: function(data){
            console.log(data.id);
            self.activeDeliveryId=data.id;
            console.log(data);
          },
          error:function(e){
            console.log(e);
          },
        });
      }


      return req;
    },


    payer(){

      var self=this;
      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/payment',
        type : 'POST',
        data : {
          "delivery_id" : self.activeDeliveryId,
          "mobile_token": localStorage.getItem('deviceId')
        },
        success: function(data){
          console.log(data);
        },
        error:function(e){
          console.log(e);
        },
      });

    },

    /*
    openCamera(){
    navigator.camera.getPicture(function(photo){
    // traitement de la camera
  }, onFail, {
  quality: 100,
  destinationType: navigator.camera.DestinationType.NATIVE_URI, // dataURL -> Return base64 encoded string.
  correctOrientation: true,
  encodingType : navigator.camera.EncodingType.JPEG,
  targetWidth : 400,
  targetHeight : 400
});
},

openGalery() {
navigator.camera.getPicture(function(photo){
//traitement de la galerie
}, onFail, {
quality: 100,
destinationType: navigator.camera.DestinationType.NATIVE_URI,
sourceType: pictureSource.PHOTOLIBRARY,
correctOrientation: true,
targetWidth : 400,
targetHeight : 400 });
},

*/

ajoutBagage(type){
  switch(type){
    case 'cabine' : this.bagagesCabine.push({'name' : '' + '' , 'descr' : ''});
    break;
    case 'soute' : this.bagagesSoute.push({'name' : '' + '' , 'descr' : ''});
    break;
    case 'autre' : this.bagagesAutre.push({ 'name' : '' + '' , 'descr' : ''});
    break;
  }
},

supprBagage(array,obj){
  var index = array.indexOf(obj);
  if (index > -1) {
    array.splice(index, 1);
  }
},

resetData(){
  this.numVol='';
  this.numTrain='';
  this.gares=[];
  this.error='';

},

isFormOk(){
  if (this.error=='' && this.startPlace !='' && this.endPlace != '' && this.date !='' && this.checkErrors() ){
    return true;
  }
},

checkErrors(){
  var ok=true;
  for (var error in this.errors){
    if (this.errors[error] != ''){
      ok=false;
    }
  }
  return ok;
},

verifBagage(){
  return (
    (this.bagagesCabine.length || this.bagagesSoute.length || this.bagagesAutre.length)
    && this.bagageOk(this.bagagesAutre) ) ;

  },

  bagageOk(tab){

    var noms=[];
    var ok=true;
    if (tab.length){
      var self=this;
      for (var i=0; i<tab.length;i++){
        if (tab[i].name == ''){
          ok=false;
        }
        else{
          if (noms.includes(tab[i].name)){
            ok=false;
          }
          else{
            noms.push(tab[i].name)
          }
        }
      }
    }
    return ok;
  },

  verifGare(){
    // Geocode recçoit des coordonées sous forme de nombre et non de Strings
    var lat = parseFloat(this.selectedGare.stop_point.coord.lat);
    var lng =  parseFloat(this.selectedGare.stop_point.coord.lon);
    var trainTime = this.selectedGare.arrival_time;
    this.time=(trainTime.substring(0,2) + ':' + trainTime.substring(2,4) );
    //  this.time.setMinutes(parseInt(trainTime.substring(2,4)));
    //  console.log(this.time);
    var pos = {lat : lat, lng : lng};
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
          self.startPlace=results[1];
          self.verifyDepartment(self.startPlace,'gare');

        }
      });

    },


    getDepartments(){
      var self=this;
      $.ajax({
        url: 'https://dev-deliverbag.supconception.fr/'+'departments/authorized',
        dataType: 'jsonp',
        success: function(json){
          for (var i=0; i<JSON.parse(json).length; i++){
            self.authorized.push(JSON.parse(json)[i].number.toString());
            self.authorized.push(JSON.parse(json)[i].name);
          }
          //console.log(JSON.stringify(self.authorized));
        },
        error : function(error){
          console.log('error ');
          console.log(error);
        }
      });
    },



    getBagages(){
      var self=this;
      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/mobile/bags/users/'+localStorage.getItem('deviceId'),
        type : 'GET',
        datatype : 'jsonp' ,
        //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
        success: function(data){
          data = JSON.parse(data);
          console.log(JSON.stringify(data));
          self.bagagesCabine=[];
          self.bagagesSoute=[];
          self.bagagesAutre=[];
          if (data.length){
            for (let i=0;i<data.length;i++){
              switch (data[i].type_id){
                case 1 :
                self.bagagesCabine.push(data[i]);
                break;
                case 2:
                self.bagagesSoute.push(data[i]);
                break;
                case 3 :
                self.bagagesAutre.push(data[i]);
                break;
              }
            }
          }
        },
        error:function(e){
          alert('erreur de connexion');
          console.log(e);
        }
      });
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
            return null;
          }
          if (status == google.maps.GeocoderStatus.OK) {
            return results[1];
          }
        });
      },
      /*
      ** Verify that the input place is in the service étrange
      ** Actually fixed on '33' , Gironde
      ** @param place : place objet that contains adresse & geolocation informations
      */
      verifyDepartment(place,lieu){
        //  console.log(this.startPlace);
        //  console.log(res);
        //var bdx_metropole = {33130, 33370 ,33110,33170,33700,33185,33530,33127,33400,33810,33290,33150,33520,33160,33310,33440,33270,33140,33560,33600,33320,33800,33100,33000,33200,33300};
        //this.error='';
        var res = place.address_components;
        var found = false;
        var isInrange = false;
        for (var i = 0; i < res.length; i++) {
          for (var j = 0; j < res[i].types.length; j++) {
            // Certains objets retournés par Google Maps n'ont pas de code "postal_code"
            // On vérifie alors la région, que l'on retrouve dans l'objet "administrative_area_level_2"
            if ( res[i].types[j] == "postal_code" || res[i].types[j] == "administrative_area_level_2" ) {
              found = true;
              var dep = res[i].short_name;
              //  console.log(dep);
              // On prend les 2 premiers chiffres pour vérifier le département
              if (this.authorized.includes(dep.substr(0,2)) || this.authorized.includes(dep)) {
                isInrange=true;
              }
            }
          }
        }
        if (isInrange){
          this.errors[lieu]='';
          // on redirige l'utilisateur sur la page suivante

          //this.$router.push( { name:'demand-next', params : {date : this.date, place : this.place} });
        }
        else{
          //console.log(this.$router);
          //this.$router.replace(this.$router.history.current.path);
          // on met une alerte pour lui dire que la gare sélectionnée n'est pas encore desservie
          var text=this.$i18n.t('error_start_place');

          if (lieu=='end'){
            text=this.$i18n.t('error_end_place');
          }
          if (lieu=='gare'){
            text=this.$i18n.t('error_gare');
          }
          this.errors[lieu]=text+this.$i18n.t('error_place');
          console.log(this.errors);
          //console.log(this.errors);
        }
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
              //console.log(data);
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

                self.date = dateGate;
                /* var minRunway = dateRunway.getMinutes();
                if (minRunway<10){
                minRunway='0'+minRunway;
              }
              */
              //console.log(data);
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
                  let lat = parseFloat(element.latitude);
                  let lng =  parseFloat(element.longitude);
                  let pos = {lat : lat, lng : lng};
                  self.geocode(pos);
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

    traitementTrain(){
      var self=this;


      if (this.numTrain.length==4){
        var dateTrain =( (this.date.split('T'))[0] + "T000000" );
        //console.log(dateTrain);
        $.get(`https://api.sncf.com/v1/coverage/sncf/vehicle_journeys/?headsign=${this.numTrain}&since=${dateTrain}&key=${this.sncf_key} `, function(data)
        {
          //console.log(data);
          self.traitement_gares(data);
        })
        .fail(function(error) {
          switch(error.status){
            case 404 : self.error=self.$i18n.t("error_404_sncf");
            break;
            case 401 : self.error=self.$i18n.t("error_401_sncf");
            break;
            case 403 : self.error=self.$i18n.t("error_403_sncf");
            break;
            case 500 : self.error=self.$i18n.t("error_500_sncf");
            break;
            default:
            if (self.date.length){
              self.error=self.$i18n.t("error_default_sncf");
            }
            else{
              self.error=self.$i18n.t("date_voyage_vide");
            }
          }


        });
      }

    },

    traitement_gares(data){

      console.log(JSON.stringify(data.disruptions));
      console.log(data);
      var stops = data.vehicle_journeys[0].stop_times;
      for (var i=1 ;i<stops.length; i++){
        var pos = {  lat : parseFloat(stops[i].stop_point.coord.lat), lng : parseFloat(stops[i].stop_point.coord.lon) } ;
        //  $(`<br> <button  class="btn btn-medium border border-green uppercase xround-2 choix_gare" data-lat="${pos.lat}" data-lng="${pos.lng}"> ${stops[i].stop_point.name}  </button>`).insertAfter($('#input_train'));
        console.log(stops[i].stop_point.name);
        console.log('*************');
        this.gares.push(stops[i]);
        console.log(this.gares);
      }
    },
  },

  mounted(){

    this.getBagages();
    this.getDepartments();
    var self=this;
    // VueJs "transforme" les HTMLInput elemnt en 'div'
    // On doit donc récupérer cet objet en passant par l'objet $refs et en definissant une propriété ref='***' dans notre input field
    var boundsGironde = new google.maps.LatLngBounds(
      new google.maps.LatLng(44.1939019, -1.2614241),
      new google.maps.LatLng(45.573636, 0.315137));

      var options = {
        bounds : boundsGironde,
        componentRestrictions : {'country' : 'fr'}
      };

      var addressEnd = this.$refs.autocomplete_end;
      var endPlace = new google.maps.places.Autocomplete(addressEnd, options);
      endPlace.addListener('place_changed', function() {
        self.endPlace=this.getPlace();
        self.verifyDepartment(self.endPlace,'end');
      });



      if (this.type=='address'){
        var addressStart = this.$refs.autocomplete_start;
        var startPlace = new google.maps.places.Autocomplete(addressStart, options);

        startPlace.addListener('place_changed', function() {
          self.startPlace=this.getPlace();
          self.verifyDepartment(self.startPlace,'start');
        });
      }
    }
  }
  </script>
<i18n src='@/assets/trad.json'></i18n>

  <style scoped>

  input {
    width: 500px;
    height:40px;
    border-bottom: 1px solid #59A34E;
    box-sizing: border-box;
  }

  </style>
