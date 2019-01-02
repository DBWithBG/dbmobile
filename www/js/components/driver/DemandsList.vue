<template>
  <div>
    <back-header message="Liste des demandes"></back-header>

    <!-- Ecran de chargement en attendant le chargement des données -->
    <div v-if="loading">
      <v-layout row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>
    </div>
    

    <div v-if="!loading" id="demands_list_main_content">
      <v-expansion-panel popout>
        <v-expansion-panel-content>
          <!-- Panel filtrage -->
          <div slot="header">{{$t('filter_demands')}}</div>
          <v-flex xs10 offset-xs1>
            <!-- Filtre 1 : distance du client, sous forme d'un slider -->
            <v-subheader>{{$t('distance_client')}}</v-subheader>
            <v-slider v-model="search[0].distance" thumb-label="always" :max="999" thumb-size="45">
              <template slot="thumb-label" slot-scope="props">
                <span>{{props.value}} km</span>
              </template>
            </v-slider>
          </v-flex>

          <!-- Filtre 2 : Nombre max de bagages, sous forme d'un slider -->
          <v-flex xs10 offset-xs1>
            <v-subheader>{{$t('max_bags')}}</v-subheader>
            <v-slider v-model="search[0].bags" thumb-label="always" :max="10"></v-slider>
          </v-flex>

          <!-- Filtre 3 : type de demandes, par défaut consignes et livraisons sont activées -->
          <!-- filtres sous forme de switchs, activés par défaut -->
          <v-layout row>
            <v-flex xs4 offset-xs1>
              <v-switch :label="$t('consignes')" color="primary" v-model="search[0].consignes"></v-switch>
            </v-flex>
          </v-layout>

          <!-- Filtre 4 : Date de la demande, par défaut toutes les dates sont affichées -->
          <v-layout class="pt-4" row>
            <v-flex xs10 offset-xs1>
              <v-subheader>{{$t('course_date')}}</v-subheader>
              <v-select
                class="mb-5"
                :items="listDate"
                v-model="search[0].date"
                single-line
                menu-props="auto"
                hide-details
              ></v-select>
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
            <td>{{props.item.start_date_moment.fromNow()}}</td>
            <td class="text-xs-center">à {{props.item.distance_from_driver}} km</td>
            <td class="text-xs-center">{{props.item.estimated_time}} {{$t('minutes')}}</td>
          </tr>
        </template>

        <!-- Si jamais il n y a rien pas de données récupérées côté serveur -->
        <template slot="no-data">{{$t('courses_empty')}}</template>

        <!-- Si jamais les critères sont trop restrictifs et ne correspondent à aucune demande -->
        <template slot="no-results">{{$t('courses_no_results')}}</template>

        <template slot="expand" slot-scope="props">
          <v-card flat>
            <v-card-text>{{$t('takeover_label')}} : {{props.item.start_position.address}}</v-card-text>
            <v-card-text>Le {{props.item.start_date_moment.format('LL')}} à {{props.item.start_date_moment.format('LT')}}</v-card-text>
            <v-card-text>{{$t('livraison_label')}} : {{props.item.end_position.address}}</v-card-text>
            <v-card-text
              v-if="!props.item.livraisonDirecte"
            >Le {{props.item.end_date_moment.format('LL')}} à {{props.item.end_date_moment.format('LT')}}</v-card-text>
            <v-card-text v-else>{{$t('livraison_asap')}}</v-card-text>
            <v-card-text>{{$t('remuneration')}} : <span class="text--success body-2">{{props.item.remuneration_driver === null ? '' : props.item.remuneration_driver + ' €'}}</span></v-card-text>
          </v-card>
          <v-list subheader>
            <v-subheader>{{props.item.bags.length}} {{$t('luggages')}}</v-subheader>
            <v-layout column>
              <v-flex v-for="bag in props.item.bags" :key="bag.index">
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
              </v-flex>
            </v-layout>
          </v-list>
          <v-btn
            flat
            color="primary"
            @click.native="route(props.item.start_position.lat,props.item.start_position.lng)"
          >
            <span>{{$t('map_display')}}</span>
          </v-btn>

          <v-btn flat color="primary" @click.native="active=props.item.id,dialogTake=true ">
            <span>{{$t('confirm_demand')}}</span>
          </v-btn>
        </template>
      </v-data-table>

      <v-dialog v-model="dialogBag">
        <v-card>
          <v-card-title class="subheading">{{$t('bagage_descr')}}</v-card-title>
          <v-card-text>
            <div v-if="modelBag.details">{{modelBag.details}}</div>
              <div v-else>{{$t('descr_empty')}}</div>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogTake" max-width="290">
        <v-card>
          <v-card-title class="subheading">{{$t('confirmer_course')}}</v-card-title>
          <v-layout row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="action" flat @click.native.stop="dialogTake=false">{{$t('cancel')}}</v-btn>
              <v-btn
                color="primary"
                flat
                @click.native.stop="dialogTake  =false,prendreEnCharge(active)"
              >Confirmer</v-btn>
            </v-card-actions>
          </v-layout>
        </v-card>
      </v-dialog>
    </div>

    <db-menu></db-menu>
  </div>
</template>


<script>
import mapStyle from "./mapStyle.js";
import axios from "axios";
import Menu from "./Menu.vue";
import BackHeader from "../BackHeader.vue";

export default {
  components: {
    "db-menu": Menu,
    "back-header": BackHeader
  },

  data() {
    return {
      // liste des bagages pour une demande
      bags: [[], [], []],
      // demande active selectionnée par le chauffeur
      active: "",
      // données en attente de chargement?
      loading: true,
      // liste de toutes les demandes clients
      deliveries_list: [],
      // position actuelle du chauffeur
      user_pos: null,
      // header de la data table
      headers: [
        {
          text: this.$i18n.t("label_heure"),
          value: "date_moment",
          align: "left"
        },
        {
          text: this.$i18n.t("distance"),
          value: "distance_from_driver",
          align: "left"
        },
        {
          text: this.$i18n.t("estimated_time"),
          value: "estimated_time",
          align: "left"
        }
      ],

      // dialog détail bagages
      dialogBag: false,
      // dialog confirmation de prise en charge
      dialogTake: false,
      // model du bagage
      modelBag: "",

      // FILTRE

      // liste des dates selectionnables
      listDate: [],

      // filtre personnalisé
      search: [
        {
          date: this.$i18n.t("any_date"),
          livraisons: true,
          consignes: true,
          distance: 999,
          temps: "",
          bags: 10
        }
      ]
    };
  },

  methods: {
    test() {
      for (let elem in this.search[0]) {
        //console.log(this.search[0][elem]);
      }
      return this.search[0];
    },

    // works on ANDROID
    // Ouvre l'appli native et affiche l'itinéraire :
    //  - origine = position actuelle
    // - destination = coordonnées passées
    route(lat, lng) {
      let addressLongLat = { lat, lng };

      window.open(
        "https://maps.google.com?daddr=" + lat + "," + lng + "&mode=d&saddr=" + this.user_pos.lat + ',' + this.user_pos.lng,
        "_system"
      );
    },

    customFilter(items, search, filter) {
      let self = this;
      //
      //console.log(search[0].id);
      //  console.log(JSON.stringify(items));
      //return items;
      
      return items.filter(
        row => {
          console.log(row);
          return row["distance_from_driver"] <= search[0].distance &&
            (self.moment(row["start_date"]).format("L") === search[0].date ||
            search[0].date == this.$i18n.t("any_date")) && 
            row["bags"].length <= search[0].bags &&
            (search[0].consignes == !(row["time_consigne"] == null))
        }
      );
    },

    getDeliveries() {
      // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
      // Autrement cet objet est overridden par les autres fonctions
      var self = this;
      let jwt = window.localStorage.getItem("jwt");

    

      axios
        .get("https://dev-deliverbag.supconception.fr/deliveries?status=1", {
          headers: {
            Authorization: "Bearer " + jwt
          }
        })
        .then(response => {
          let data = response.data;
          self.deliveries_list = data;
          self.getDistanceFromDriver();
        })
        .catch(error => {
          console.log(JSON.stringify(error));
          self.loading = false;
        });
    },

    prendreEnCharge(id) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      var req = {
        status_id: "2",
        mobile_token: localStorage.getItem("deviceId"),
        delivery_id: id
      };

      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status",
          req,
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.$router.replace({ path: "/my-deliveries-driver" });
        })
        .catch(error => {
          console.error(JSON.stringify(error));
          this.$swal({
            type: 'error',
            title: 'oups',
            text: 'Error in prendreEnCharge'
          });
        });
    },

    getDistanceFromDriver() {
      var self = this;
      var origin = new google.maps.LatLng(
        parseFloat(self.user_pos.lat),
        parseFloat(self.user_pos.lng)
      );
      var service = new google.maps.DistanceMatrixService();

      self.deliveries_list.forEach(function(elem, index, array) {
        elem.start_date_moment = self.moment(elem.start_date);
        elem.end_date_moment = self.moment(elem.end_date);
        //  elem.date_formatted=new Date(elem.start_date).toLocaleString().slice(0,18);

        var dest = elem.start_position.address;

        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [dest],
            travelMode: "DRIVING"
          },
          function(rep) {
            var dist = rep.rows[0].elements[0].distance.text.replace("km", "");
            elem.distance_from_driver = dist;
            if (index === array.length - 1) {
              setTimeout(function() {
                self.$forceUpdate();
                self.loading = false;
              }, 1000);
            }
          }
        );
      });
    },

    getUserPos() {
      var self = this;
      
      navigator.geolocation.getCurrentPosition(
        
        // Success callback
        position => {
          self.user_pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          self.getDeliveries();
        },

        // Error callback
        error => {
          self.$swal({
            type: 'error',
            title: 'Oups...',
            text: self.$i18n.t('error_getting_position')
          });
          console.log(JSON.stringify(error));
          self.getUserPos();
        }, {
          maximumAge: 10000,
          timeout: 5000,
          enableHighAccuracy: true
        }
      );
    },

    requestGps() {
      var self = this;

      cordova.plugins.locationAccuracy.request(
        function(success) {
          self.getUserPos();
        },
        function(error) {
          self.requestGps();
        },
        cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
      );
    }
  },

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
    this.listDate.unshift(this.$i18n.t("any_date"));
    this.getUserPos();
  }
};
</script>

      

<style scoped>
td {
  border-bottom: 2px solid #ddd;
}
tr {
  height: 100px;
}
#demands_list_main_content {
  padding-bottom: 4em;
}
</style>