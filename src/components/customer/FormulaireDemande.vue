<template>
  <div>

    <!-- header retourn arrière -->
    <back-header :message="$t('header')"> </back-header>

    <!-- STEPPER Horizontal de progression-->
    <v-stepper v-model="step">
      <v-stepper-header>
        <!-- étape 1 : infos de prise en chagre et livraison -->
        <v-stepper-step :complete="step > 1" step="1" > {{$t('subt_1')}}</v-stepper-step>
        <!-- étape 2 : infos de bagages-->
        <v-stepper-step :complete="step > 2" step="2">{{$t('subt_2')}}</v-stepper-step>
        <!-- étape 3 : récap et paiement-->
        <v-stepper-step step="3">{{$t('subt_3')}}</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- PRISE EN CHARGE -->
        <v-stepper-content step="1">
          <v-subheader > {{$t('subt_1')}}</v-subheader>
            <v-flex mt-4 mb-3 xs12 >
              <span class="subheading" >{{$t('info_1')}}</span>
            </v-flex>

          <!-- MESSAGES D'ERREURS -->
            <v-flex xs12>
              <div v-if="error.length">
                <alert :message="error"> </alert>
              </div>
            </v-flex>

            <v-flex xs12>
              <div v-for="error in errors">
                <alert v-if="error !='' " :message="error"> </alert>
              </div>
            </v-flex>

          <v-layout row>
            <v-flex xs10>
              <!-- DATE PICKER START -->
              <v-menu ref="menudate" :close-on-content-click="false" :nudge-right="40" :return-value.sync="date" transition="scale-transition" offset-y full-width min-width="290px">
                <v-text-field
                slot="activator" v-model="displayDate" v-bind:label="$t('label_date')" prepend-icon="event" readonly>
              </v-text-field>
              <v-date-picker v-model="date" :min="minDate" @input="$refs.menudate.save(date),resetData()" color="primary" no-title scrollable :locale="this.$root.$i18n.locale" >

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
                slot="activator" v-model="displayTime" v-bind:label="$t('label_heure')" append-icon="access_time" readonly>
              </v-text-field>
              <v-time-picker v-model="time" :min="minTime" :format="$t('date_format')" @change="$refs.menutime.save(time)" color="primary" no-title :locale="this.$root.$i18n.locale" > </v-time-picker>
          </v-menu>
        </v-flex>
      </div>
    </v-layout>


      <v-flex v-if="type == 'train'" row xs6 offset-xs3>
        <!-- NUMERO DE TRAIN si arrivée par train -->
        <v-text-field v-model="numTrain" v-on:input="traitementTrain" v-on:click="resetData" pattern="\d*" type="number" :placeholder="$t('train_number')">
        </v-text-field>
      </v-flex>

      <!-- SELECTION DE L'ARRET EN GARE POUR TRAIN -->
      <v-flex v-if="gares.length" xs12>

        <!--
        Le texte du select correspond au NOM de la gare
        L'objet que l'on traite est un OBJET gare contentant plus d'infos
        Lorsque l'on choisit une gare, on apelle verifGare() qui vérifie :
        - le lieu
        - les horaires
        -->
        <v-select
        :items="gares"
        v-model="selectedGare"
        item-text="gare.stop_point.name"
        item-value="gare"
        v-bind:label="$t('select_gare')"
        single-line
        v-on:input="verifGare"
        ></v-select>
      </v-flex>


    <!-- NUMERO DE VOL POUR VOL -->
      <v-flex xs12 v-if="type == 'flight'">
        <input v-model="numVol" v-on:input="traitementVol" v-on:click="resetData" type="text"  maxlength="6" :placeholder="$t('flight_number')">
      </v-flex>

    <!-- ADRESSE DE PRISE EN CHARGE POUR ADRESSE -->
      <v-flex xs12 v-if="type == 'address'">
        <input class="autocomplete" ref="autocomplete_start" v-bind:placeholder="$t('label_address_depart')"/>
      </v-flex>


    <!-- INFORMATIONS DE LIVRAISON ET TYPE DE PRESTATION -->
      <v-flex mt-4 mb-3 xs12 >
        <span class="subheading" >{{$t('info_2')}}</span>
      </v-flex>


    <!-- ADRESSE DE LIVRAISON POUR TOUS LES CAS -->
      <v-flex xs12>
        <input class="autocomplete" ref="autocomplete_end" v-bind:placeholder="$t('label_address_livraison')" />
      </v-flex>

      <!-- SWITCH correspondant au type de prestation : livraison ou consigne
       par défaut consigne
     -->
      <v-flex mt-3 mb-2 xs12>
        <v-switch v-bind:label="$t('livraison')" v-model="livraisonDirecte" color="primary"> </v-switch>
      </v-flex>


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



  <!-- Bouton pour continuer la saisie des Informations
       Désactivé si le form n'est pas valide
  -->
<v-flex xs12 >
  <v-btn :disabled="!isFormOk()" color="primary" @click.native="step=2"dark >
    <span> {{$t('next')}}</span>
    <v-icon right>navigate_next</v-icon>
  </v-btn>
</v-flex>

</v-stepper-content>


<!-- Deuxième étape : saisie des bagages -->

<v-stepper-content step="2">
  {{$t('luggages')}}


  <!-- Gestion des bagages -->

    <v-flex xs12>
      <v-btn color="primary" @click.native="ajoutBagage('cabine')" dark > {{$t('bagages_ajout')}} {{$t('bagage_cabine')}}</v-btn>
      <div v-for="bag in bagagesCabine" :key="bag.id">
        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesCabine, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            ></v-text-field>
          </v-flex>
          <v-divider vertical> </v-divider>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>


    <v-flex xs12 >
      <v-btn  color="primary" @click.native="ajoutBagage('soute')" dark >{{$t('bagages_ajout')}} {{$t('bagage_soute')}} </v-btn>
      <div v-for="bag in bagagesSoute" :key="bag.id">
        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesSoute, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            ></v-text-field>
          </v-flex>
          <v-divider vertical> </v-divider>
          <v-flex xs5>
            <v-text-field  box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>

      </div>
    </v-flex>

    <v-flex xs12>
      <v-btn  color="primary" @click.native="ajoutBagage('autre')" dark >{{$t('bagages_ajout')}} {{$t('bagage_autre')}}</v-btn>
      <div v-for="bag in bagagesAutre" :key="bag.id">
        <v-layout row>
          <v-flex xs2>
            <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesAutre, bag)">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5>
            <v-text-field  required box v-bind:label="$t('bagage_nom')" v-model="bag.name"
            :rules="[() => bag.name.length > 0 || $t('bagage_required')]"
            ></v-text-field>
          </v-flex>
          <v-divider vertical> </v-divider>
          <v-flex xs5>
            <v-text-field box v-bind:label="$t('bagage_descr')" v-model="bag.descr"></v-text-field>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>

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
      <v-btn :disabled="!verifBagage()" color="primary" @click.native="step=3" dark >
        {{$t('next')}}
        <v-icon>navigate_next</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>

</v-stepper-content>

<v-stepper-content step="3">
  <!-- Récapitulatif -->
  <v-card>
    {{reponse()}}
  </v-card>

  <v-btn  color="orange lighten-1" @click.native="step=2" dark >{{$t('prev')}}</v-btn>
  <v-btn  color="primary" @click.native="payer()" dark >{{$t('payer')}} </v-btn>
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

      // définit l'étape actuelle du formulaire
      step:0,

      // correspond à l'id de la delivery
      // id utilisé pour payer après la création d'une demande
      activeDeliveryId:'',

      // définit le type de prestation souhaitée, true=livraison, false=consigne
      livraisonDirecte:false,

      // date minimum pour le picker, correspond à la date actuelle fromatée pour le picker
      minDate:new Date().toISOString().substring(0,10),

      // correspond à la date de prise en charge
      date:new Date().toJSON(),

      // correspond à l'heure de prise en charge
      time:new Date(),

      // correspond à la date de livraison
      dateEnd:new Date().toJSON(),

      // correspond à l'heure de livraison
      timeEnd:new Date(),

      // lieu de prise en charge
      startPlace:'',

      // lieu de livraison
      endPlace:'',

      // message d'erreur
      error:'',

      // toutes les erreurs lors de la saisie (date incorrecte, lieu non desservi...)
      errors:{},

      // les départements authorisés qui seront pris en compte
      authorized:[],

      // api key sncf
      sncf_key:'7308cd76-a20f-4f01-9cc3-59d4742bba24',

      // numéro de train saisi
      numTrain :'',

      // liste des gares correspondant à ce train
      gares:[],

      // arrêt choisi par le client
      selectedGare:null,

      // app id flightstats
      flight_app_id : '95a4eb71',

      // app key flightstats
      flight_app_key : '84cb52736b8c4db53b753b8f87be34a8',

      // numéro de vol saisi
      numVol : '',

      // array des bagages cabine
      bagagesCabine : [],

      // array des bagages soute
      bagagesSoute : [],

      // array des bagages autre
      bagagesAutre : []
    }
  },

// les proprités computed sont des données qui sont réactives au changement
// on les utilise de la même manière que les données classiques

  computed:{

    // Id de la compagnie aérienne
    compagnyId(){
      return this.numVol.substring(0,2);
    },
    // Id du vol
    flightId(){
      return this.numVol.substring(2,6);
    },

    // Date minimale pour la prise en charge
    // si la date est aujourd'hui, restriction (pas avant l'heure courante)
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

    // Date minimale pour la consigne en fonction à la date de prise en charge indiquée
    minDateEnd(){
      this.dateEnd = new Date(this.date).toISOString().substring(0,10)
      return new Date(this.date).toISOString().substring(0,10);
    },

    // Date max pour la consigne
    // TODO: plage horaire continue ou non, restrictions à définir
    maxDateEnd(){
     //return new Date(this.date).toISOString().substring(0,10);
    },

    // Heure min pour la consigne
    minTimeEnd(){

    },

    // Heure max pour la consigne
    maxTimeEnd(){
    },

    // assemblage et formatage de la date et de l'heure de départ
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

    // assemblage et formatage de la date et de l'heure de livraison
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


    // assemblage et formatage de la date et de l'heure de prise en charge
    // utilisée pour l'envoi des données au serveur
    dateStartToJson(){
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

    // assemblage et formatage de la date et de l'heure de livraison
    // utilisée pour l'envoi des données au serveur
    dateEndToJson(){
      console.log(this.timeEnd);
      var date = new Date(this.dateEnd);
      if (typeof this.timeEnd === 'string'){
        date.setHours(this.timeEnd.match(/^(\d+)/)[1]);
        date.setMinutes(this.timeEnd.match(/:(\d+)/)[1]);
      }
      else{
        date.setHours(this.timeEnd.getHours());
        date.setMinutes(this.timeEnd.getMinutes());
      }
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(),  date.getHours(), date.getMinutes(), date.getSeconds())).toJSON().split('.')[0].replace('T',' ');
    },

    // Affichage du label du datepicker PRISE EN CHARGE de manière plus "humaine" pour l'utilisateur
    displayDate(){
      return this.dateTime.substring(0,10);
    },

    // Affichage du label du timepicker PRISE EN CHARGE de manière plus "humaine" pour l'utilisateur
    displayTime(){
      return this.dateTime.substring(12,18);
    },

    // Affichage du label du datepicker LIVRAISON de manière plus "humaine" pour l'utilisateur
    displayDateEnd(){
      return this.dateTimeEnd.substring(0,10);
    },

    // Affichage du label du timepicker LIVRAISON de manière plus "humaine" pour l'utilisateur
    displayTimeEnd(){
      return this.dateTimeEnd.substring(12,18);
    }

  },

  methods : {

    reponse(){

      if (this.step==3) {
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
            "start_date" : this.dateStartToJson,
            "end_date" : this.dateEndToJson,
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
  this.errors={}

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
    //console.log(JSON.stringify(this.selectedGare));
    // Geocode recçoit des coordonées sous forme de nombre et non de Strings
    var lat = parseFloat(this.selectedGare.stop_point.coord.lat);
    var lng =  parseFloat(this.selectedGare.stop_point.coord.lon);
    var trainTime = this.selectedGare.arrival_time;
    //this.time=(trainTime.substring(0,2) + ':' + trainTime.substring(2,4) );

//    console.log("train : " + this.time);
    this.time = this.moment(trainTime.substring(0,4), "hmm").format("HH:mm");

      console.log("now : " + this.moment().format('LT'))
      console.log("train : " + this.time)
    console.log(this.time<this.moment().format('LT'));


    if ( this.time<this.moment().format('LT') ){
      this.errors['error_date'] = this.$i18n.t('error_heure');
    }
    else{
      this.errors['error_date']='';
    }
    //  this.time.setMinutes(parseInt(trainTime.substring(2,4)));

    var pos = {lat : lat, lng : lng};
    var self=this;

    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
      'latLng': pos},
      function(results,status){
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

      verifyDepartment(place,lieu){
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
              // On prend les 2 premiers chiffres pour vérifier le département
              if (this.authorized.includes(dep.substr(0,2)) || this.authorized.includes(dep)) {
                isInrange=true;
              }
            }
          }
        }
        if (isInrange){
          this.errors[lieu]='';
        }
        else{
          // on met une alerte pour lui dire que le lieu n'est pas encore desservi
          var text=this.$i18n.t('error_start_place');

          if (lieu=='end'){
            text=this.$i18n.t('error_end_place');
          }
          if (lieu=='gare'){
            text=this.$i18n.t('error_gare');
          }
          this.errors[lieu]=text+this.$i18n.t('error_place');
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

    //  console.log(JSON.stringify(data.disruptions));
    //  console.log(data);
      var stops = data.vehicle_journeys[0].stop_times;
      for (var i=1 ;i<stops.length; i++){
        var pos = {  lat : parseFloat(stops[i].stop_point.coord.lat), lng : parseFloat(stops[i].stop_point.coord.lon) } ;
        //  $(`<br> <button  class="btn btn-medium border border-green uppercase xround-2 choix_gare" data-lat="${pos.lat}" data-lng="${pos.lng}"> ${stops[i].stop_point.name}  </button>`).insertAfter($('#input_train'));
    //  console.log(stops[i].stop_point.name);
  //      console.log('*************');
        this.gares.push({
          'gare' : stops[i]
        });
    //    console.log(this.gares);
      }
    },
  },

  mounted(){

    this.getBagages();
    this.getDepartments();
    var self=this;
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
