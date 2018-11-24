<template>


  <div id="home">
    <v-container 
      grid-list-lg 
      :class="{'px-0': $vuetify.breakpoint.xsOnly }" v-touch="{
      left:swipeLeft ,
      right:swipeRight
      }">
      <v-layout row wrap>

        <v-flex xs12>
        <v-card class="vh" color="green lighten-4" :to="{name :'demande-form' , params: {type:'address'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline">
                <v-icon left>add_location</v-icon>
                {{$t("address")}}</h3>
              <div> {{$t("address_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

    <!--
      Pour accéder au formulaire de demande avec saisie de numéro de train
    -->

      <v-flex xs12>
        <v-card class="vh" color="light-green lighten-4" :to="{name :'demande-form' , params: {type:'train'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline">
                <v-icon left>train</v-icon>
                {{$t("train")}}
              </h3>
              <div> {{$t("train_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

    <!--
      Pour accéder au formulaire de demande avec saisie de numéro de vol
    -->
      <v-flex xs12>
        <v-card class="vh" color="lime lighten-4" :to="{name :'demande-form' , params: {type:'flight'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline">
                <v-icon left>flight</v-icon>
                {{$t("flight")}}</h3>
              <div> {{$t("flight_subt")}} </div>
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
import Menu from './Menu.vue'

export default {

  components: {
    'db-menu':  Menu
  },

  methods: {
    webviewConnexion() {
      var view = cordova.InAppBrowser.open(
        "https://dev-deliverbag.supconception.fr/connexion",
        "_self",
        "location=no,zoom=no"
      );
      console.log(view);
      view.close();
      view.executeScript({ code: '(console.log("test"))' });
    },
    swipeRight() {
      this.$router.replace({ path: "courses" });
    },
    swipeLeft() {
      this.$router.replace({ path: "demands" });
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
</style>
