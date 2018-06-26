<template>
  <div id="home">
    <p> Voici les demandes clients actuelles </p>

    <v-btn flat color="green darken-2" :to="{name :'demands-list' , params: {data:deliveries} }">
      <span>Accéder à la liste des demandes</span>
    </v-btn>

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

      <v-btn flat color='green' @click.native="prendreEnCharge(active_demand.id)">
        <span>M'engager sur cette demande</span>
      </v-btn>

    </div>
    <p> Fin de la carte </p>
    <db-menu> </db-menu>

        </div>
</template>


<script>

import mapStyle from '@/assets/mapStyle.json'



export default {


  data(){
    return {
      map:null,
      user_pos:null,
      user_marker:null,
      active_demand:null,
      active_end_marker:null,
      active_start_marker:null,
      deliveries:null,
      deliveries_markers:[],
      markers:[]
    }
    },


    methods:{


      prendreEnCharge(id){

        var req = {
          "mobile_token" : '23456',
          "delivery_id" : id
        }

        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/takeovers/start',
          type : 'POST',
          data : req,
          success: function(data){
          },
          error:function(e){
            console.log(e);
          },
        });
      },


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
            center: {lat: 44.836151, lng: -0.580816},
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
                  self.deliveries=data;
                  //console.log(JSON.stringify(data));

                  for (var i=0; i<data.length; i++){

                    console.log(data[i].start_position.address);
                    var marker_start = new google.maps.Marker(
                      {
                          icon: 'http://maps.google.com/mapfiles/ms/icons/red.png' ,
                          position : {
                          lat: data[i].start_position.lat,
                          lng: data[i].start_position.lng
                        },
                        infos : data[i]
                      });


                      self.deliveries_markers.push(marker_start.position);


                      if (self.deliveries_markers.filter(e => e.lat() == marker_start.position.lat()).length > 0) {
                        var a = 360.0 / data.length;
                        var newLat =marker_start.position.lat() + -.0004 * Math.cos((+a*i) / 180 * Math.PI);
                        var newLng = marker_start.position.lng() + -.0004 * Math.sin((+a*i) / 180 * Math.PI);  //Y
                        var latLng = new google.maps.LatLng(newLat,newLng);
                        marker_start.setPosition(latLng);
                      }

                      self.markers.push(marker_start);
                      marker_start.setMap(self.map);
                      var marker_end;

                        marker_start.addListener('click', function() {

                          if (self.active_start_marker != null){
                          self.active_start_marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red.png');
                        }

                          this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue.png');
                          self.active_start_marker=this;

                          if (self.active_end_marker != null){
                            self.active_end_marker.setMap(null)
                          }


                           marker_end = new google.maps.Marker(
                            {
                              icon: 'http://maps.google.com/mapfiles/ms/icons/blue.png' ,
                              position : {
                                lat: this.infos.end_position.lat ,
                                lng: this.infos.end_position.lng
                              }

                            });

                          self.active_end_marker = marker_end;

                          marker_end.setMap(self.map);
                          self.active_demand = this.infos;

                        });

                          }
                          // pas une solution pour l'affichage des 2 markers de début et de fin
                          //var markerCluster = new MarkerClusterer(self.map,self.markers,{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});


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


            <style scoped>

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
