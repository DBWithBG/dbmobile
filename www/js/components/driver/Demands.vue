<template>
  <div>
    <v-btn flat color="primary" :to="{name :'DemandsListDriver'}">
      <span>Accéder à la liste des demandes</span>
    </v-btn>

    <v-layout row>
      <v-flex xs2>
        <v-btn :disabled="retour" color="primary" @click.native="reset()">
          <v-icon>navigate_before</v-icon>
          {{$t('retour')}}
        </v-btn>
      </v-flex>
      <v-flex xs6 offset-xs3>
        <v-select
          append-icon="event"
          outline
          class="primary--text"
          :items="listDate"
          v-model="activeDate"
          single-line
          menu-props="auto"
          hide-details
          @input="getDeliveries()"
        ></v-select>
      </v-flex>
    </v-layout>
    <div id="google-map"></div>

    <v-dialog v-model="dialogTake" max-width="290">
      <v-card>
        <v-card-title class="headline">{{$t('confirmer_course')}}</v-card-title>
        <v-layout row>
          <v-card-actions>
            <v-btn color="action" flat @click.native.stop="dialogTake=false">{{$t('cancel')}}</v-btn>
            <v-btn
              color="primary"
              flat
              @click.native.stop="dialogTake=false,prendreEnCharge(demandId)"
            >{{$t('confirmer')}}</v-btn>
          </v-card-actions>
        </v-layout>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogMap">
      <v-btn class="cross" dark icon color="error" fixed @click.native.stop="dialogMap = false">
        <v-icon>close</v-icon>
      </v-btn>
      <v-flex v-for="demand in active_demands" :key="demand.id">
        <v-flex mt-4>
          <v-card>
            <v-card-title class="subheading">{{moment(demand.start_date).format('LLL')}}</v-card-title>
            <v-card-text>
              <v-flex v-if="demand.remuneration_driver" row><b>{{$t('remuneration')}} :</b> {{demand.remuneration_driver + ' €'}}</v-flex>
              <v-divider v-if="demand.remuneration_driver" class="divider_modal"></v-divider>
              <v-flex row><b>{{$t('takeover_label')}} :</b> {{demand.start_position.address}}</v-flex>
              <v-flex row>Le {{moment(demand.start_date).format('LL')}} à {{moment(demand.start_date).format('LT')}}</v-flex>
              <v-divider class="divider_modal"></v-divider>
              <v-flex row><b>{{$t('livraison_label')}} :</b> {{demand.end_position.address}}</v-flex>
              <v-flex v-if="demand.time_consigne!=null">
                le {{moment(demand.end_date).format('LL')}} à {{moment(demand.end_date).format('LT')}}
              </v-flex>
              <v-flex v-else>{{$t('livraison_asap')}}</v-flex>
            

            <v-divider class="divider_modal"></v-divider>

            <v-list subheader>
              <b>Consigne :</b> {{demand.time_consigne}}
            <v-subheader>{{demand.bags.length}} {{$t('luggages')}}</v-subheader>
            <v-layout column>
              <div v-for="bag in demand.bags" :key="bag.id">
                <v-chip
                  xs6
                  v-if="bag.type_id===1"
                  color="teal lighten-2"
                  text-color="white"
                  @click.native.stop="dialogBag=true,modelBag=bag"
                >
                  {{bag.name}}
                  <v-icon right>work</v-icon>
                </v-chip>

                <v-chip
                  v-if="bag.type_id===2"
                  color="teal darken-1"
                  text-color="white"
                  @click.native.stop="dialogBag=true,modelBag=bag"
                >
                  {{bag.name}}
                  <v-icon right>work</v-icon>
                </v-chip>

                <v-chip
                  v-if="bag.type_id===3"
                  color="teal darken-4"
                  text-color="white"
                  @click.native.stop="dialogBag=true,modelBag=bag"
                >
                  {{bag.name}}
                  <v-icon right>work</v-icon>
                </v-chip>
              </div>
              <v-btn
                color="primary"
                @click.native="seeOnMap(demand.start_position.lat,demand.start_position.lng,demand.end_position.lat,demand.end_position.lng)"
              >
                <span>Voir sur la carte</span>
              </v-btn>
              <v-btn color="primary" @click.native="dialogTake=true,demandId=demand.id">
                <span>{{$t('confirm_demand')}}</span>
              </v-btn>
            </v-layout>
          </v-list>
            
            </v-card-text>
            
            
          </v-card>

          
          <v-divider></v-divider>
        </v-flex>
      </v-flex>
    </v-dialog>

    <v-dialog v-model="dialogBag" max-width="290">
      <v-card>
        <v-card-title class="headline">{{$t('bagage_descr')}}</v-card-title>
        <v-layout row>
          <v-flex xs10 offset-xs1>
            <div v-if="modelBag.details">{{modelBag.details}}</div>
            <div v-else>{{$t('descr_empty')}}</div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>

    <db-menu></db-menu>
  </div>
</template>


<script>
import mapStyle from "./mapStyle.js";
import Menu from "./Menu.vue";
import axios from "axios";
import MarkerClustererPlus from "@google/markerclustererplus";

export default {
  components: {
    "db-menu": Menu
  },

  data() {
    return {
      // google map (google api)
      map: null,

      // marker cluster (google api)
      markerCluster: null,

      // position du chauffeur
      user_pos: null,

      // marker du chauffeur
      user_marker: null,

      // les demandes correspondant au(x) marqueur(x)
      // tableau car possibilité d'avoir plusieurs demandes au même endroit
      active_demands: [],

      // toutes les demandes récupérées côté serveur
      deliveries: null,

      // tous les marqueurs correspondant aux demandes
      markers: [],

      // liste des dates selectionnables
      listDate: [],
      // date du jour
      activeDate: this.moment().format("L"),

      // modèle correspondant au bagage sélectionné
      modelBag: "",

      // dialog pour confirmer la prise en charge
      dialogTake: false,

      // dialog pour avoir plus d'infos lors du clic sur un marker
      dialogMap: false,

      // dialog pour le détail d'un bagage
      dialogBag: false,

      // marker pour la prise en charge
      m_start: null,

      // marker pour la livraison
      m_end: null,

      // bouton retour désactivé?
      retour: true
    };
  },

  methods: {
    /**
     * Pour prendre en charge une demande
     * POST /mobile/drivers/deliveries/edit-status
     * Avec:
     * status_id = 2
     * delivery_id = id
     */
    prendreEnCharge(id) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      var req = {
        status_id: "2",
        delivery_id: id
      };

      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status",
          {
            req
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          localStorage.setItem("driver_course_to_open", id);
          self.$router.replace({ path: "/my-deliveries-driver" });
        })
        .catch(error => {
          console.log(error);
        });
    },

    /**
     * Initialisation de la carte Google Map
     */
    initMap() {
      this.map = new google.maps.Map(document.getElementById("google-map"), {
        center: { lat: 44.836151, lng: -0.580816 },
        zoom: 12,
        disableDefaultUI: true,
        gestureHandling: "greedy",
        styles: mapStyle.style
      });
    },

    // on initialise le marker correspondant à la position du chauffeur
    initUserMarker() {
      var self = this;

      self.user_marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 }
      });

      self.user_marker.setMap(self.map);
    },

    // on initiliase la position du chauffeur et on la relie au marqueur correspondant
    initUserPos() {
      var self = this;
      window.timer = setInterval(function() {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            self.user_pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            self.user_marker.setPosition(self.user_pos);
            if (!self.user_marker.getVisible())
              self.user_marker.setVisible(true);
          },
          function() {}
        );
      }, 3000);
    },

    // pour clear le timer qui récupère la position de l'utilisateur
    clearTimer() {
      clearInterval(window.timer);
    },

    // pour clear les markers, on clear le cluster qui englobe ces derniers
    clearMarkers() {
      this.markerCluster.clearMarkers();
    },

    // pour ajouter les markers à la map, on les relie au cluster
    addMarkersToMap() {
      this.markerCluster.addMarkers(this.markers);
    },

    // on remet à zéro les marqueurs
    reset() {
      this.retour = true;
      this.clearMarkers();
      this.m_start.setMap(null);
      this.m_end.setMap(null);
      this.addMarkersToMap();
      this.map.setCenter({ lat: 44.836151, lng: -0.580816 });
      this.map.setZoom(12);
    },

    // pour récupérer les deliveries côté serveur
    getDeliveries() {
      if (this.m_start != null) this.m_start.setMap(null);
      if (this.m_end != null) this.m_end.setMap(null);
      var self = this;
      self.markers = [];

      if (this.markerCluster != null) {
        this.clearMarkers();
      }

      let jwt = window.localStorage.getItem("jwt");

      axios
        .get("https://dev-deliverbag.supconception.fr/deliveries?status=1", {
          headers: {
            Authorization: "Bearer " + jwt
          }
        })
        .then(response => {
          // On a récupéré les données, on effectue le traitement ici
          var data = JSON.parse(response.data);
          self.deliveries = data;
          // on itère sur les donnée qu'on récupère
          for (var i = 0; i < data.length; i++) {
            // on récupère la date correspondant à la delivery
            var data_date = self.moment(data[i].startDate).format("L");
            //  var data_date = new Date(data[i].start_date).toLocaleString().slice(0,10);
            // on vérifie si elle correspond à la date du filtre
            if (data_date === self.activeDate) {
              // on crée un noveau marker à l'endroit de la prise en charge
              var marker_start = new google.maps.Marker({
                icon: "http://maps.google.com/mapfiles/ms/icons/red.png",
                position: {
                  lat: data[i].start_position.lat,
                  lng: data[i].start_position.lng
                },
                infos: data[i]
              });

              // on décrit les évènements qui se passent lorsque l'on clique sur le marker correspondant à la prise en charge

              marker_start.addListener("click", function() {
                // on reset les demandes actives
                self.active_demands = [];
                // on récupère les informations de la delivery
                self.active_demands.push(this.infos);
                // on ouvre le dialog pour avoir les détail de la course (ou des courses)
                self.dialogMap = true;
              });
              // on ajoute le marker à la liste des markers
              self.markers.push(marker_start);
            }
          }
          // on crée le cluster qui englobe tous les marqueurs
          self.markerCluster = new MarkerClustererPlus(self.map, self.markers, {
            zoomOnClick: false,
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
          });
          
          self.markerCluster.addListener("click", function(cluster) {
            self.active_demands = [];
            cluster.getMarkers().forEach(function(marker) {
              self.active_demands.push(marker.infos);
            });
            // on ouvre le dialog pour avoir le détail de la demande (ou des demandes)
            self.dialogMap = true;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },

    // pour visualiser uniquement les 2 markers correspondant à une demande
    // on passe les 4 positions nécessaires à la création de 2 markers
    seeOnMap(start_lat, start_lng, end_lat, end_lng) {
      // on efface tous les autres marqueurs présents sur la carte
      this.clearMarkers();
      // on ferme le détail de la course
      this.dialogMap = false;
      // on crée des nouveaux objets correspondant aux positions indiquées dans la delivry
      var latLng_start = new google.maps.LatLng(start_lat, start_lng);
      var latLng_end = new google.maps.LatLng(end_lat, end_lng);
      // on crée des bornes
      let bounds = new google.maps.LatLngBounds();
      // on crée un marker de début et de fin
      this.m_start = new google.maps.Marker({ position: latLng_start });
      this.m_end = new google.maps.Marker({ position: latLng_end });
      // on les ajoute à la carte
      this.m_start.setMap(this.map);
      this.m_end.setMap(this.map);
      // on étend les bornes aux marqueurs que l'on vient de créer
      bounds.extend(latLng_start);
      bounds.extend(latLng_end);
      // on ajuste la map aux bornes
      this.map.fitBounds(bounds);
      // on active le bouton de retour
      this.retour = false;
    }
  },
  // Une fois que Vue.js a initalisé et compilé les éléments
  mounted() {
    let self = this;
    let now = this.moment();
    let end = this.moment().add(15, "days");
    var getDaysArray = function(s, e) {
      for (var a = [], d = s; d <= e; d.add(1, "days")) {
        a.push(self.moment(d).format("L"));
      }
      return a;
    };
    this.listDate = getDaysArray(now, end);
    this.initMap();
    this.initUserMarker();
    this.initUserPos();
    this.getDeliveries();

  },

  destroyed() {
    this.clearTimer();
  }
};
</script>


        <style scoped>
.cross {
  z-index: 9999;
}

p {
  font-size: 1em;
  text-align: center;
}

#google-map {
  height: 75vh;
  width: 100%;
}

.divider_modal {
  margin-top: 1em;
  margin-bottom: 1em;
}
</style>