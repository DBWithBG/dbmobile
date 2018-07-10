<template>


  <div v-touch="{
    left:swipeLeft ,
    right:swipeRight
    }">

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card elevation-5 :to="{name :'demande-form' , params: {type:'address'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">
                <v-icon left>add_location</v-icon>
                {{$t("address")}}</h3>
              <div class="text-xs-center"> {{$t("address_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card elevation-5 :to="{name :'demande-form' , params: {type:'train'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">
                <v-icon left>train</v-icon>
                {{$t("train")}}</h3>
              <div class="text-xs-center"> {{$t("train_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card elevation-5 :to="{name :'demande-form' , params: {type:'flight'} }">
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0 text-xs-center">
                <v-icon left>flight</v-icon>
                {{$t("flight")}}</h3>
              <div class="text-xs-center"> {{$t("flight_subt")}} </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>




    <db-menu> </db-menu>
  </div>


</template>


<script>



export default{



  data(){
    return {
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


</style>
