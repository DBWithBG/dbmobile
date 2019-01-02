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

    <div v-if="!loading">
      <!-- Onglets -->
      <v-tabs fixed-tabs slider-color="primary" id="tabs">
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
                  <v-expansion-panel-content>
                    <div slot="header">Le {{props.item.delivery.start_date_formatted}}</div>

                    <v-flex row xs12>
                      <v-layout align-center justify-space-around>

                        <v-flex xs4 class="text-xs-center">
                          {{ props.item.delivery.start_position.address }}
                          <v-divider></v-divider>
                          <b>{{moment(props.item.delivery.start_date).format('LLL')}}</b>
                        </v-flex>

                        <v-flex row xs1>
                          <v-icon align-center>arrow_forward</v-icon>
                        </v-flex>

                        <v-flex xs4 class="text-xs-center">
                          {{ props.item.delivery.end_position.address }}
                          <v-divider></v-divider>
                          <div v-if="props.item.delivery.time_consigne!=null">
                            <b>{{moment(props.item.delivery.end_date).format('LLL')}}</b>
                          </div>
                          <div v-else>
                            <b>{{$t('livraison_asap')}}</b>
                          </div>
                        </v-flex>
                      </v-layout>

                      <v-flex class="remuneration-flex" xs12 mt-4>
                        <b>{{$t('remuneration')}} : </b>{{props.item.delivery.remuneration_driver}} €
                      </v-flex>

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
                <v-card-title class="subheading">{{$t('cancel_takeover')}}</v-card-title>

                <v-card-text>{{$t('cancel_takeover_confirm')}}</v-card-text>
                <v-card-text>{{$t('cancel_takeover_info')}}</v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="secondary" flat @click.native.stop="dialogDel=false">{{$t('no')}}</v-btn>
                  <v-btn
                    color="error"
                    flat
                    @click.native.stop="dialogDel=false,cancelTakeover(active)"
                  >{{$t('yes')}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="detailBag" max-width="290">
              <v-card>
                <v-card-title class="subheading">{{$t('details_bag')}}</v-card-title>
                <v-card-text>
                  <div v-if="modelBag.details">{{modelBag.details}}</div>
                  <div v-else>{{$t('descr_empty')}}</div>
                </v-card-text>
              </v-card>
            </v-dialog>

            <v-dialog v-model="dialogBag">
              <v-card>
                <v-card-title class="subheading">{{$t('label_edl')}}</v-card-title>
                <v-card-text>
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
                      <v-text-field v-bind:label="label_bag(bag.name)" v-model="bag.edl"></v-text-field>
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
                      <v-text-field v-bind:label="label_bag(bag.name)" v-model="bag.edl"></v-text-field>
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
                      <v-text-field v-bind:label="label_bag(bag.name)" v-model="bag.edl"></v-text-field>
                    </div>
                  </v-flex>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :disabled="!edlOk"
                    class="text-xs-center"
                    color="primary"
                    @click.native.stop="edlBags(active.bags)"
                  >Valider</v-btn>
                </v-card-actions>
                
                  
                  
                
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
      user_pos: null,
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

    navigator.geolocation.getCurrentPosition((position) => {
      this.user_pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    });

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
            elem.delivery.start_date_formatted = self.moment(new Date(
              elem.delivery.start_date
            )).format('LLL');
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
          self.$swal({
            type: 'success',
            title: self.$i18n.t('operation_successfull'),
            text:  self.$i18n.t('snackbar_cancel')
          });
        }).catch(error => {
          console.log(error);
        });
    },

    // works on ANDROID
    // Ouvre l'appli native et affiche l'itinéraire :
    //  - origine = position actuelle
    // - destination = coordonnées passées
    route(lat, lng) {
      let addressLongLat = { lat, lng };
      
      console.log(this.user_pos);

      window.open(
        "https://maps.google.com?daddr=" + lat + "," + lng + "&mode=d&saddr=" + this.user_pos.lat + ',' + this.user_pos.lng,
        "_system"
      );
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

    label_bag(bag_name) {
      return this.$i18n.t('etat_bag') + ' ' + bag_name;
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
          self.$swal({
            type: 'success',
            title: self.$i18n.t("lets_go"),
            text: self.$i18n.t("snackbar_bags")
          });
          // on initialise un timer pour tracker le chauffeur
          window.getDriverPos = setInterval(function() {
            navigator.geolocation.getCurrentPosition(function(position) {
              console.log(position.coords.longitude);
              axios
                .put(
                  "https://dev-deliverbag.supconception.fr/drivers/setPosition",
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
          self.$swal({
            type: 'success',
            title: self.$i18n.t('thanks'),
            text: self.$i18n.t('snackbar_dest')
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>

<style scoped>
#tabs {
  padding-bottom: 4em;
}

.remuneration-flex {
  padding: 16px;
}

</style>

  