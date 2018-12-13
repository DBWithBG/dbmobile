<template>
  <div id="home">
    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card
            class="vh"
            color="green lighten-4"
            :to="{name :'DemandForm' , params: {type:'address'} }"
          >
            <v-card-title primary-title>
              <div>
                <h4 class="headline">
                  <v-icon left>add_location</v-icon>
                  {{$t("address")}}
                </h4>
                <div class="card-text">{{$t("address_subt")}}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

        <!--
      Pour accéder au formulaire de demande avec saisie de numéro de train
        -->
        <v-flex xs12>
          <v-card
            class="vh"
            color="light-green lighten-4"
            :to="{name :'DemandForm' , params: {type:'train'} }"
          >
            <v-card-title primary-title>
              <div>
                <h3 class="headline">
                  <v-icon left>train</v-icon>
                  {{$t("train")}}
                </h3>
                <div class="card-text">{{$t("train_subt")}}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

        <!--
      Pour accéder au formulaire de demande avec saisie de numéro de vol
        -->
        <v-flex xs12>
          <v-card
            class="vh"
            color="lime lighten-4"
            :to="{name :'DemandForm' , params: {type:'flight'} }"
          >
            <v-card-title primary-title>
              <div>
                <h3 class="headline">
                  <v-icon left>flight</v-icon>
                  {{$t("flight")}}
                </h3>
                <div class="card-text">{{$t("flight_subt")}}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <db-menu></db-menu>
  </div>
</template>


<script>
import Menu from "./Menu.vue";

export default {
  components: {
    "db-menu": Menu
  },

  mounted() {
    let self = this;

    if (typeof cordova.plugins != "undefined") {
      console.log("Registering onMessage callback");
      cordova.plugins.firebase.messaging.onMessage(function(payload) {
        let title = payload.gcm.title;
        let body = payload.gcm.body;
        self.$swal({
          type: "info",
          title: title,
          text: body
        });
      });
    }
  }
};
</script>


<style>
p {
  font-size: 2em;
  text-align: center;
}

a {
  text-decoration: none;
}

.card-text {
  padding-top: 0.8em;
}
</style>
