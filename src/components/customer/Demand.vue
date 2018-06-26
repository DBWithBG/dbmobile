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
              <h3 class="headline mb-0 text-xs-center">J'indique une adresse</h3>
              <div> Choisissez un lieu et une heure de prise en charge pour vos bagages </div>
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
              <h3 class="headline mb-0 text-xs-center">J'arrive en train</h3>
              <div> Vos bagages seront pris en charge à l'arrivée de votre train en gare </div>
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
              <h3 class="headline mb-0 text-xs-center">Je voyage en avion</h3>
              <div> Partez l'esprit serein en indiquant simplement votre numéro de vol </div>
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
      this.$router.replace({path: 'profile-customer'});
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
