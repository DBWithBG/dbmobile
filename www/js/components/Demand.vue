<template>


  <div id="home">
    <v-container :class="{'px-0': $vuetify.breakpoint.xsOnly }" v-touch="{
      left:swipeLeft ,
      right:swipeRight
      }">
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card elevation-5 to="/demand-address">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0 text-xs-center">J'indique une adresse</h3>
                <div> Choisissez un lieu et une heure de prise en charge pour vos bagages </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card elevation-10 to="/demand-train">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0 text-xs-center">J'arrive en train</h3>
                <div> Vos bagages seront pris en charge à l'arrivée de votre train en gare </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-card elevation-15 to="/demand-flight">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0 text-xs-center">Je voyage en avion</h3>
                <div>Partez l'esprit serein en indiquant simplement votre vol </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-btn v-on:click="webviewConnexion"> Connexion
    </v-btn>

    </v-container>
    <db-menu> </db-menu>

  </div>
</template>


<script>


import Menu from './Menu.vue';

export default{


  components : {
    'db-menu' : Menu
  },

  data(){
    return {
    }
  },

  methods: {
    webviewConnexion(){
      var view = cordova.InAppBrowser.open('https://dev-deliverbag.supconception.fr/connexion', '_self', 'location=no,zoom=no',);
      console.log(view);
      view.close();
      view.executeScript({code:'(console.log("test"))'});


    },
    swipeRight(){
      this.$router.replace({path: 'courses'});
    },
    swipeLeft(){
      this.$router.replace({path: 'demands'});
    }
  }
}


</script>


<style>

p {
  font-size:2em;
  text-align:center;
}

a {
  text-decoration:none;
}


</style>
