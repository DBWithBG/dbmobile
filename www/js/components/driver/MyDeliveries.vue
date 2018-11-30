<template>
  <div>
    <!-- Ecran de chargement lorsque l'on attend le chargement des données -->
    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>

    <div v-if="!loading" v-touch="{
      left:swipeLeft
      }">
      <!-- Onglets -->
      <v-tabs fixed-tabs slider-color="primary">
        <v-tab v-for="tab in tabs" :key="tab.id">{{ tab }}</v-tab>
        <v-tabs-items :v-model="tabs">
          <v-tab-item v-for="tab in demandes" :key="tab.id">
            <v-data-table
              :headers="headers"
              :items="tab"
              hide-actions
              class="elevation-1"
              hide-headers
            >
              <template slot="items" slot-scope="props">
                <v-expansion-panel>
                  <v-expansion-panel-content :value="open == props.item.delivery.id">
                    <div slot="header">Le {{props.item.delivery.start_date_formatted.slice(0,18)}}</div>

                    <v-flex row xs12>
                      <v-layout align-center justify-space-around>
                        <v-flex xs4 class="text-xs-center">
                          {{ props.item.delivery.start_position.address }}
                          <v-divider></v-divider>
                          {{moment(props.item.delivery.start_date).format('LLL')}}
                        </v-flex>

                        <v-flex row xs1>
                          <v-icon align-center>arrow_forward</v-icon>
                        </v-flex>

                        <v-flex xs4 class="text-xs-center">
                          {{ props.item.delivery.end_position.address }}
                          <v-divider></v-divider>
                          <div
                            v-if="props.item.delivery.time_consigne!=null"
                          >{{moment(props.item.delivery.end_date).format('LLL')}}</div>
                          <div v-else>{{$t('livraison_asap')}}</div>
                        </v-flex>
                      </v-layout>

                      <v-list class="mt-4" subheader>
                        <v-subheader>{{props.item.delivery.bags.length}} {{$t('luggages')}}</v-subheader>
                        <v-layout column>
                          <v-flex v-for="bag in props.item.delivery.bags" :key="bag.id">
                            <v-chip
                              xs6
                              v-if="bag.type_id===1"
                              color="teal lighten-2"
                              text-color="white"
                              @click.native.stop="detailBag=true,modelBag=bag"
                            >
                              {{bag.name}}
                              <v-icon right>work</v-icon>
                            </v-chip>
                            <v-chip
                              v-if="bag.type_id===2"
                              color="teal darken-1"
                              text-color="white"
                              @click.native.stop="detailBag=true,modelBag=bag"
                            >
                              {{bag.name}}
                              <v-icon right>work</v-icon>
                            </v-chip>
                            <v-chip
                              v-if="bag.type_id===3"
                              color="teal darken-4"
                              text-color="white"
                              @click.native.stop="detailBag=true,modelBag=bag"
                            >
                              {{bag.name}}
                              <v-icon right>work</v-icon>
                            </v-chip>
                          </v-flex>
                        </v-layout>
                      </v-list>
                    </v-flex>

                    <!-- Annuler la prise en charge, uniquement si les bagages n'ont pas été pris en charge -->
                    <div v-if="props.item.delivery.status === 2">
                      <v-flex row>
                        <v-btn
                          color="primary"
                          @click.native="route(props.item.delivery.start_position.lat,props.item.delivery.start_position.lng)"
                        >
                          <span>{{$t('map_display')}}</span>
                        </v-btn>
                        <v-btn
                          dark
                          color="secondary"
                          @click.native.stop="dialogBag=true, active=props.item.delivery"
                        >{{$t('take_bags')}}</v-btn>
                      </v-flex>
                      <v-btn
                        color="error"
                        @click.native.stop="dialogDel=true, active=props.item.delivery"
                      >{{$t('cancel_course')}}</v-btn>

                      <!-- Prendre en charges les bags, uniquement si les bagages n'ont pas été pris en charge -->
                    </div>

                    <!-- Livrer les bags, uniquement si les bagages ont été pris en charge -->
                    <div v-if="props.item.delivery.status === 3">
                      <v-btn
                        color="primary"
                        @click.native="route(props.item.delivery.end_position.lat,props.item.delivery.end_position.lng)"
                      >
                        <span>{{$t('map_display')}}</span>
                      </v-btn>
                      <v-btn
                        dark
                        color="secondary"
                        @click.native.stop="endCourse(props.item.delivery)"
                      >{{$t('deliver_bags')}}</v-btn>
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>

              <!-- Si jamais il n y a pas de données -->
              <template slot="no-data">{{$t('courses_empty')}}</template>
            </v-data-table>

            <v-dialog v-model="dialogDel" max-width="290">
              <v-card>
                <v-card-title class="headline">{{$t('cancel_takeover')}}</v-card-title>

                <v-card-text>{{$t('cancel_takeover_confirm')}}</v-card-text>
                <v-card-text>{{$t('cancel_takeover_info')}}</v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="secondary"
                    flat
                    @click.native.stop="dialogDel=false"
                  >{{$t('cancel')}}</v-btn>
                  <v-btn
                    color="error"
                    flat
                    @click.native.stop="dialogDel=false,cancelTakeover(active)"
                  >{{$t('delete')}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="detailBag" max-width="290">
              <v-card>
                <v-card-title class="headline">{{$t('details_bag')}}</v-card-title>
                <v-layout row>
                  <v-flex xs10 offset-xs1>
                    <div v-if="modelBag.details">{{modelBag.details}}</div>
                    <div v-else>{{$t('descr_empty')}}</div>
                  </v-flex>
                </v-layout>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogBag" max-width="290">
              <v-card>
                <v-layout column>
                  <v-flex pt-2 pb-4 class="text-xs-center">{{$t('label_edl')}}</v-flex>
                  <v-flex v-for="bag in active.bags" :key="bag.id">
                    <div class="text-xs-center" v-if="bag.type_id===1">
                      <v-chip
                        xs6
                        color="teal lighten-2"
                        text-color="white"
                        @click.native.stop="detailBag=true,modelBag=bag"
                      >
                        {{bag.name}}
                        <v-icon right>work</v-icon>
                      </v-chip>
                      <v-text-field box v-bind:label="$t('etat_bag')" v-model="bag.edl"></v-text-field>
                    </div>

                    <div class="text-xs-center" v-if="bag.type_id===2">
                      <v-chip
                        color="teal darken-1"
                        text-color="white"
                        @click.native.stop="detailBag=true,modelBag=bag"
                      >
                        {{bag.name}}
                        <v-icon right>work</v-icon>
                      </v-chip>
                      <v-text-field box v-bind:label="$t('etat_bag')" v-model="bag.edl"></v-text-field>
                    </div>

                    <div class="text-xs-center" v-if="bag.type_id===3">
                      <v-chip
                        color="teal darken-4"
                        text-color="white"
                        @click.native.stop="detailBag=true,modelBag=bag"
                      >
                        {{bag.name}}
                        <v-icon right>work</v-icon>
                      </v-chip>
                      <v-text-field box v-bind:label="$t('etat_bag')" v-model="bag.edl"></v-text-field>
                    </div>
                  </v-flex>
                  <v-btn
                    :disabled="!edlOk"
                    class="text-xs-center"
                    color="primary"
                    @click.native.stop="edlBags(active.bags)"
                  >Valider</v-btn>
                </v-layout>
              </v-card>
            </v-dialog>

            <v-snackbar v-model="snackbar" color="primary" bottom>{{snackbarText}}</v-snackbar>
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </div>

    <db-menu></db-menu>
  </div>
</template>


<script>

import Menu from "./Menu.vue";
import axios from "axios";

export default {
  components: {
    "db-menu": Menu
  },

  data() {
    return {
      open: -1,
      snackbar: "",
      snackbarText: "",
      headers: [
        { text: this.$i18n.t("distance"), value: "distance" },
        { text: this.$i18n.t("prix"), value: "price" },
        { text: this.$i18n.t("estimated_time"), value: "estimated_time" }
      ],

      deviceid: "",
      dialogDel: false,
      dialogBag: false,
      tabs: [this.$i18n.t("tab_en_cours"), this.$i18n.t("tab_passees")],
      demandes: [[], []],
      day: "",
      active: "",
      loading: true,
      detailBag: false,
      modelBag: ""
    };
  },

  computed: {
    edlOk() {
      let ok = true;
      if (this.active != "") {
        this.active.bags.forEach(function(elem) {
          if (elem.edl != undefined) {
            if (elem.edl.length <= 0) {
              ok = false;
            }
          } else {
            ok = false;
          }
        });
      } else {
        ok = false;
      }
      return ok;
    }
  },

  mounted() {
    if (localStorage.getItem("driver_course_to_open") != null) {
      this.open = localStorage.getItem("driver_course_to_open");
    }
    this.getCourses();
  },

  destroyed() {
    localStorage.setItem("driver_course_to_open", null);
  },

  methods: {
    getCourses() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      this.demandes = [[], []];

      axios
        .get(
          "https://dev-deliverbag.supconception.fr/mobile/deliveries/drivers",
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          let data = response.data;
          console.log(data);
          data.forEach(function(elem, index, array) {
            elem.delivery.start_date_formatted = new Date(
              elem.delivery.start_date
            ).toLocaleString();
            switch (elem.delivery.status) {
              case 2:
                self.demandes[0].push(elem);
                break;
              case 3:
                self.demandes[0].push(elem);
                break;
              case 4:
                self.demandes[0].push(elem);
                break;
              case 5:
                self.demandes[1].push(elem);
            }
            if (index === array.length - 1 || array.length === 0) {
              self.loading = false;
              setTimeout(function() {
                self.$forceUpdate();
              }, 1000);
            }
          });

          self.demandes[0].sort(function(a, b) {
            return (
              new Date(a.delivery.start_date) - new Date(b.delivery.start_date)
            );
          });

          self.demandes[1].sort(function(a, b) {
            return (
              new Date(b.delivery.start_date) - new Date(a.delivery.start_date)
            );
          });

          self.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },

    cancelTakeover(delivery) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status",
          {
            delivery_id: delivery.id,
            status_id: "1"
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.demandes = [[], [], []];
          self.getCourses();
          self.snackbar = true;
          self.snackbarText = self.$i18n.t("snackbar_cancel");
        })
        .catch(error => {
          console.log(error);
        });
    },

    // works on ANDROID
    // Ouvre l'appli native et affiche l'itinéraire :
    //  - origine = position actuelle
    // - destination = coordonnées passées
    route(lat, lng) {
      //window.open("google.navigation:q="+lat+","+lng+"&mode=d" , '_system');
      let addressLongLat = { lat, lng };

      if (device.platform == "Android") {
        window.open(
          "google.navigation:q=" + lat + "," + lng + "&mode=d",
          "_system"
        );
        //  window.open("geo:"+addressLongLat);
      }
      if (device.platform == "iOS") {
        window.open("http://maps.apple.com/?q=" + addressLongLat, "_system");
      }
    },

    rateBag(bag) {},

    edlBags(bags) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      var details = [];
      self.active.bags.forEach(function(elem) {
        details.push({
          bag_id: elem.pivot.bag_id,
          detail: elem.edl
        });
      });

      axios
        .put(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/infobags/edit",
          {
            delivery_id: self.active.id,
            details: details
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.dialogBag = false;
          self.takeBag();
        })
        .catch(error => {
          console.log(error);
        });
    },

    takeBag() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status",
          {
            delivery_id: self.active.id,
            status_id: "3"
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.demandes = [[], [], []];
          self.getCourses();
          // pour savoir quelle course ouvrir
          self.open = self.active.id;
          self.snackbar = true;
          self.snackbarText = self.$i18n.t("snackbar_bags");
          // on initialise un timer pour tracker le chauffeur
          window.getDriverPos = setInterval(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
              console.log(position.coords.longitude);
              axios
                .put(
                  "https://dev-deliverbag.supconception.fr/mobile/drivers/setPosition",
                  {
                    current_lat: position.coords.latitude,
                    current_lng: position.coords.longitude
                  },
                  {
                    headers: {
                      Authorization: "Bearer " + jwt
                    }
                  }
                )
                .then(response => {})
                .catch(error => {
                  console.log(error);
                });
            });
          }, 3000);
        })
        .catch(error => {
          console.log(error);
        });
    },

    endCourse(delivery) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status",
          {
            status_id: "5",
            delivery_id: delivery.id
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.demandes = [[], [], []];
          self.getCourses();
          self.open = delivery.id;
          self.snackbar = true;
          self.snackbarText = self.$i18n.t("snackbar_dest");
        })
        .catch(error => {
          console.log(error);
        });
    },

    bagStateTake(id, rating, com) {
      let jwt = window.localStorage.getItem("jwt");
      console.log(com);

      if (com != undefined) {
        this.ratingSent = true;
      }
      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/deliveries/ratings",
          {
            delivery_id: id,
            details: com,
            rating: rating
          },
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {})
        .catch(error => {
          console.log(error);
        });
    },

    swipeLeft() {
      this.$router.replace({ path: "demands" });
    },
    detailsCourse(id) {
      var ref = window.open(
        "http://dev-deliverbag.supconception.fr/mobile/deliveries/" +
          id +
          "?mobile_token=" +
          localStorage.getItem("deviceId"),
        "_blank",
        "location=no,zoom=no"
      );
    }
  }
};
</script>

  <style>
tbody li {
  width: 100vw;
}
</style>

  