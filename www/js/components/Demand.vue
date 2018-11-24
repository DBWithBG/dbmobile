<template>


  <div id="home">
    <v-container 
      grid-list-lg 
      :class="{'px-0': $vuetify.breakpoint.xsOnly }" v-touch="{
      left:swipeLeft ,
      right:swipeRight
      }">
      <v-layout row wrap>

        <v-flex md12>
          <v-card elevation-5 to="/demand-address" color="blue-grey darken-2" class="white--text" >
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">J'indique une adresse</h3>
                <div> Choisissez un lieu et une heure de <br/>prise en charge pour vos bagages </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      

      
        <v-flex md12>
          <v-card elevation-10 to="/demand-train" color="cyan darken-2" class="white--text">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">J'arrive en train</h3>
                <div> Vos bagages seront pris en charge à l'arrivée de votre train en gare </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      

      
        <v-flex md12>
          <v-card elevation-15 to="/demand-flight" color="purple" class="white--text">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Je voyage en avion</h3>
                <div>Partez l'esprit serein en indiquant simplement votre vol </div>
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
