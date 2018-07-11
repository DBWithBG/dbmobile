<template>
  <div>
    <back-header message="Liste des demandes"> </back-header>


    <!-- vue 2.5 use slot-scope -->

    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>



    <div v-if="!loading">

      <v-expansion-panel popout>
        <v-expansion-panel-content>
        <div slot="header">Filtrer les demandes</div>
        <v-flex xs10 offset-xs1>
          <v-subheader>Distance du client</v-subheader>
          <v-slider
          v-model="search[0].distance"
          thumb-label="always"
          :max="999"
          thumb-size="45"
          >
          <template slot="thumb-label" slot-scope="props">
            <span>
              {{props.value}} km
            </span>
          </template>
        </v-slider>
      </v-flex>

      <v-flex xs10 offset-xs1>
        <v-subheader>Nombre de bagages max</v-subheader>
        <v-slider
        v-model="search[0].bags"
        thumb-label="always"
        :max="10"
        >
      </v-slider>
    </v-flex>

    <v-flex xs10 offset-xs1>
      <v-subheader>Type de course</v-subheader>
      <v-select multiple chips :items="listType" v-model="search[0].type" single-line auto hide-details></v-select>
    </v-flex>

    <v-layout class="pt-2" row>
      <v-flex xs10 offset-xs1>
        <v-subheader >Date de la course</v-subheader>
        <v-select class="mb-5":items="listDate" v-model="search[0].date" single-line auto hide-details></v-select>
      </v-flex>

    </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>








<v-data-table
:headers="headers"
:items="deliveries_list"
:search="search"
:custom-filter="customFilter"
hide-actions
item-key="id"
>


<template slot="items" slot-scope="props">
  <tr @click="props.expanded = !props.expanded">

    <td class="text-xs-left"> {{props.item.date_formatted}} </td>
    <td class="text-xs-left"> à {{props.item.distance_from_driver}} km </td>
    <td class="text-xs-left"> {{props.item.estimated_time}} minutes</td>

  </tr>
</template>

<template slot="no-data">
  {{$t('courses_empty')}}
</template>

<template slot="no-results">
  Aucune course ne correspond à ces critères.
</template>



<template slot="expand" slot-scope="props">
  <v-card flat>
    <v-card-text> Prise en charge : {{props.item.start_position.address}}</v-card-text>
    <v-card-text> Livraison : {{props.item.end_position.address}}</v-card-text>
  </v-card>


  <v-list subheader>
    <v-subheader> {{props.item.bags.length}} bagages </v-subheader>
    <v-layout column>

      <v-flex v-for="bag in props.item.bags" :key="bag.id">
        <v-chip xs6 v-if="bag.type_id===1" color="teal lighten-2" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
          <v-dialog v-model="detailBag" max-width="290">
            <v-card>
              <v-card-title class="headline">Détail de ce bagage</v-card-title>
              <v-layout row>
                <v-flex xs10 offset-xs1>
                  <div v-if="modelBag.details">
                    {{modelBag.details}}
                  </div>
                  <div v-else>
                    Aucune description n'a été indiquée par le client
                  </div>
                </v-flex>
              </v-layout>
            </v-card>
          </v-dialog>
          {{bag.name}}
          <v-icon right>work</v-icon>
        </v-chip>

        <v-chip v-if="bag.type_id===2" color="teal darken-1" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
          {{bag.name}}
          <v-icon right>work</v-icon>
        </v-chip>

        <v-chip v-if="bag.type_id===3" color="teal darken-4" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
          {{bag.name}}
          <v-icon right>work</v-icon>
        </v-chip>

      </v-flex>
    </v-layout>
  </v-list>

  <v-btn flat color='primary' @click.native="prendreEnCharge(props.item.id)">
    <span>M'engager sur cette demande</span>
  </v-btn>
</template>
</v-data-table>
</div>
</div>
</template>


<script>



export default {



  data () {
    return {
      bags:[
        [],
        []  ,
        []
      ],
      loading:true,
      deliveries_list: [],
      user_pos:null,
      listDate:[],
      listType:[
        'Livraison', 'Consigne'
      ],
      headers: [
        { text: this.$i18n.t('label_heure'), value: 'date_formatted' , align: 'left'},
        { text: this.$i18n.t('distance'), value: 'distance_from_driver', align: 'left'},
        { text: this.$i18n.t('estimated_time'), value: 'estimated_time' ,align: 'left'}
      ],
      search:[
        {
          date : new Date().toLocaleString().slice(0,10),
          type : ['Livraison','Consigne'],
          distance : 999,
          temps : '',
          bags:10
        }],
        detailBag:false,
        modelBag:''
      }
    },



    methods:{

      test(){

        for (let elem in this.search[0]){
          //console.log(this.search[0][elem]);
        }
        return this.search[0];
      },

      customFilter(items, search, filter) {

        //
        //console.log(search[0].id);
        //  console.log(JSON.stringify(items));
        //return items;

        return items.filter(row =>
          //console.log(row["distance_from_driver"])
          (row["distance_from_driver"] <= search[0].distance)   &&
          (new Date(row["start_date"]).toLocaleString().slice(0,10) === search[0].date) &&
          (row["bags"].length <= search[0].bags)

        );

      },

      getDeliveries(){
        // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
        // Autrement cet objet est overridden par les autres fonctions
        var self=this;

        $.ajax({
          url: 'https://dev-deliverbag.supconception.fr/'+'deliveries?status=1',
          dataType: 'jsonp',
          success: function(json){
            //  console.log(json);
            // On a récupéré les données, on effectue le traitement ici
            // On a récupéré les données, on effectue le traitement ici
            var data=JSON.parse(json);
            self.deliveries_list=data;
            self.getDistanceFromDriver();
          }
        });
      },

      prendreEnCharge(id){
        let self=this;
        var req = {
          "status_id" : '2',
          "mobile_token" : localStorage.getItem('deviceId'),
          "delivery_id" : id
        }

        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status',
          type : 'POST',
          data : req,
          success: function(data){
            self.$router.replace({path: '/courses-driver'});
          },
          error:function(e){
            console.log(e);
          },
        });
      },

      getDistanceFromDriver(){

        var self=this;
        var origin = new google.maps.LatLng(parseFloat(self.user_pos.lat),parseFloat(self.user_pos.lng));
        var service = new google.maps.DistanceMatrixService();
        var b = new Date().valueOf();
        var msMinute = 60*1000;
        var msDay = 60*60*24*1000;
        //  self.data[i]['distance_from_driver']=self.getDistance();
        //    console.log(self.data[i]['distance_from_driver']);


        self.deliveries_list.forEach(function(elem,index,array){


          let a = new Date(elem.start_date).valueOf();
          elem.date_formatted=new Date(elem.start_date).toLocaleString().slice(0,18);
          let mins = Math.floor(((a - b) % msDay) / msMinute);
          let h = Math.floor(mins / 60);
          let m = mins % 60;
          h = h < 10 ? '0' + h : h;
          m = m < 10 ? '0' + m : m;
          elem.time=(h+':'+m);


          var dest = elem.start_position.address;

          service.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [dest],
              travelMode: 'DRIVING'
            }, function(rep){
              var dist = (rep.rows[0].elements[0].distance.text.replace('km',''));
              elem.distance_from_driver=dist;
              if (index === array.length -1){

                setTimeout(function(){ self.$forceUpdate(); self.loading=false;}, 1000);

              }
            });
          });

        },

        getUserPos(){
          var self=this;
          //let hard_gps = cordova.plugins.locationAccuracy;

          navigator.geolocation.getCurrentPosition(

            function(position){
              self.user_pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              self.getDeliveries();
              //self.user_marker.setMap(self.map);
            },
            function(error){
              self.requestGps();
              //self.requestGps();
            });

          },

          requestGps(){
            var self=this;

            cordova.plugins.locationAccuracy.request(
              function(success){
                self.getUserPos();
              },
              function(error){
                self.requestGps();
              },cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
            }



          },

          mounted(){
            //console.log(self);
            /*
            cordova.plugins.locationAccuracy.request(function(){
            self.getUserPos();
          }, function(){
          alert('Erreur - Tried to access GPS')} ,
          cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);

          */
          let now = new Date();
          let end = new Date();
          end.setDate(end.getDate()+15);
          var getDaysArray = function(s,e) {for(var a=[],d=s;d<=e;d.setDate(d.getDate()+1)){ a.push(new Date(d).toLocaleString().slice(0,10));}return a;};
          this.listDate = getDaysArray(now,end);

          let self=this;
          //  self.requestGps();
          self.getUserPos();

        }
      }
      </script>

      <i18n src='@/assets/trad.json'></i18n>

      <style>


      th {
        background-color: #59A34E;
        color: white!important;
      }

      td {
        padding-bottom: 20px!important;
        padding-top: 20px!important;
        border-bottom: 2px solid #ddd;
      }
      </style>
