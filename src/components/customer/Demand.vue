<template>


  <div v-touch="{
    left:swipeLeft ,
    right:swipeRight
    }">

<!--
  Pour accéder au formulaire de demande avec saisie d'adresses
-->
      <v-flex xs12>
        <v-card class="vh" color="green lighten-4" :to="{name :'demande-form' , params: {type:'address'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline text-xs-center">
                <v-icon left>add_location</v-icon>
                {{$t("address")}}</h3>
              <div class="text-xs-center"> {{$t("address_subt")}} </div>
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
              <h3 class="headline text-xs-center">
                <v-icon left>train</v-icon>
                {{$t("train")}}
              </h3>
              <div class="text-xs-center"> {{$t("train_subt")}} </div>
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
              <h3 class="headline text-xs-center">
                <v-icon left>flight</v-icon>
                {{$t("flight")}}</h3>
              <div class="text-xs-center"> {{$t("flight_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

    <db-menu> </db-menu>
  </div>


</template>


<script>


export default{

  data(){
    return {
      value:''
    }
  },

  methods: {

    swipeRight(){
      this.$router.replace({path: 'courses'});
    },
    swipeLeft(){
      this.$router.replace({path: 'settings'});
    }
  }
}


</script>
<i18n src='@/assets/trad.json'></i18n>

<style>

p {
  font-size:2em;
  text-align:center;
}

a {
  text-decoration:none;
}

body{
  height:92vh;
}

.vh{
  height:30.5vh;
}


</style>
