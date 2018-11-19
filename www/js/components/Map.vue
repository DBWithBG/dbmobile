<template>
  <div id="home">
    <p> Voici les demandes clients actuelles </p>
    <div id="google-map" > </div>
    <div id="demand-description" v-if="active_demand !== null">
      <p> Descriptif de cette demande </p>
      <ul>
        <li >
          <p> Commentaire : {{ active_demand.comment}} </p>
          <p> Prix : {{ active_demand.price}} </p>
          <p> Adresse de prise en charge : {{ active_demand.start_position.address}} </p>
          <p> Adresse de livraison : {{ active_demand.end_position.address}} </p>
        </li>
      </ul>
    </div>
    <p> Fin de la carte </p>
    <db-menu> </db-menu>
  </div>
</template>


<script>

import mapStyle from '../mapStyle.json'
import Home from './Home.vue';
import Menu from './Menu.vue';

export default {

  components : {
    'db-component': Home,
    'db-menu' : Menu
  },

  data(){
    return {
      map:null,
      user_pos:null,
      user_marker:null,
      active_demand:null
    }
  },


  methods:{

    checkGps(){

      cordova.plugins.locationAccuracy.request(function(){
        this.initMap();
        this.initUserMarker();
        this.initUserPos();
      }, function(){
        alert('Erreur - Tried to access GPS')} ,
        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
      },
    initMap(){


        this.map = new google.maps.Map(document.getElementById('google-map'), {
          center: {lat: 48.6843900, lng: 6.1849600},
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          styles:mapStyle
        });
      },

    initUserMarker(){


        // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
        // Autrement cet objet est overridden par les autres fonctions
        var self=this;

        self.user_marker = new google.maps.Marker(
          {
            position : {lat: 0, lng: 0}
          });

          self.user_marker.setMap(self.map);
          self.user_marker.setVisible(false);

          self.user_marker.addListener('click', function() {

            //console.log(vm.map);
            //console.log(self.map);
            self.map.setZoom(15);
            self.map.setCenter(self.user_marker.getPosition());
            var lat = self.user_marker.getPosition().lat();
            var lng = self.user_marker.getPosition().lng();
            self.methode();
            //self.route(lat,lng);
          });
        },

        initUserPos(){


          // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
          // Autrement cet objet est overridden par les autres fonctions
          var self=this;

          self.user_pos= {lat: 0, lng: 0};
          window.timer = setInterval(function() {
            //console.log(self);
            navigator.geolocation.getCurrentPosition(
              function(position){
                self.user_pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                },

                self.user_marker.setPosition(self.user_pos);
                if (!self.user_marker.getVisible()) self.user_marker.setVisible(true);
                //self.user_marker.setMap(self.map);
              },function(){
                alert('fail - get current pos');
              })
            },3000);
          },

          clearTimer(){
            clearInterval(window.timer);
          },

          getDeliveries(){
            // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
            // Autrement cet objet est overridden par les autres fonctions
            var self=this;

            $.ajax({
              url: 'https://dev-deliverbag.supconception.fr/'+'deliveries',
              dataType: 'jsonp',
              success: function(json){
                // On a récupéré les données, on effectue le traitement ici
                var data=JSON.parse(json);
                console.log(JSON.stringify(data));

                for (var i=0; i<data.length; i++){


                  var infoW = new google.maps.InfoWindow({
                    // InfoWindow content
                    /*
                    content : `<div id="iw-container">
                    <div class="iw-title"> ${data[i].name} </div>
                    <div class="iw-content">
                    <div class="iw-subTitle">data</div>
                    <div class="iw-subTitle">data</div>
                    </div>
                    <div class="iw-bottom-gradient"></div>
                    </div> `
                    */
                    content : `<db-component> </db-component>`
                  });



                  var marker_start = new google.maps.Marker(
                    {
                      position : {
                        lat: data[i].start_position.lat,
                        lng: data[i].start_position.lng
                      },
                      infos : data[i]
                    });

                    marker_start.setMap(self.map);

                    var marker_end = new google.maps.Marker(
                      {
                        position : {
                          lat: data[i].end_position.lat ,
                          lng: data[i].end_position.lng
                        }

                      });

                      marker_start.addListener('click', function() {

                        self.active_demand = this.infos;
                        infoW.open(self.map, marker_start);
                        marker_end.setMap(self.map);
                      });

                      infoW.addListener('closeclick', function() {
                        self.active_demand=null;
                        marker_end.setMap(null);
                      });
                    }

                  },
                  error:function(e){
                    console.log(e);
                  }
                });
              },

              addDeliveriesMarkers(){

              }
            },
            // Une fois que Vue.js a initalisé et compilé les éléments
            mounted(){
              this.initMap();
              this.initUserMarker();
              this.initUserPos();
              this.getDeliveries();
            },

            destroyed(){
              this.clearTimer();
            },
          }


          </script>


          <style>

          p {
            font-size:1em;
            text-align:center;
          }


          #google-map {
            height:300px;
            width: 100%;
          }


          #iw-container {
            margin-bottom: 10px;
          }
          #iw-container .iw-title {
            font-family: 'Open Sans Condensed', sans-serif;
            font-size: 22px;
            font-weight: 400;
            padding: 10px;
            background-color: #48b5e9;
            color: white;
            margin: 0;
            border-radius: 2px 2px 0 0;
          }
          #iw-container .iw-content {
            font-size: 13px;
            line-height: 18px;
            font-weight: 400;
            margin-right: 1px;
            padding: 15px 5px 20px 15px;
            max-height: 140px;
            overflow-y: auto;
            overflow-x: hidden;
          }
          .iw-content img {
            float: right;
            margin: 0 5px 5px 10px;
          }
          .iw-subTitle {
            font-size: 16px;
            font-weight: 700;
            padding: 5px 0;
          }
          .iw-bottom-gradient {
            position: absolute;
            width: 326px;
            height: 25px;
            bottom: 10px;
            right: 18px;
            background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
            background: -ms-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%);
          }


          /*
          InfoWindow customization
          */


          </style>
