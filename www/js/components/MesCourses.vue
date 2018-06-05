<template>


<div id="home">
  <v-container :class="{'px-0': $vuetify.breakpoint.xsOnly }" v-touch="{
    left:swipeLeft
    }">
    <v-tabs fixed-tabs>
      <v-tab v-for="tab in tabs" >
        {{ tab }}
      </v-tab>
      <v-tab-item v-for="tab in tabs">
        {{ tab }}
      </v-tab-item>

    </v-tabs>
  </v-container>
</div>
</template>


<script>

export default {
  data () {
    return {
      tabs: [
        'En cours', 'Passées', 'Prévues']
      }
    },

    methods: {
      demandsNow(){

      },
      demandsPast(){

      },
      demandsPlanned(){

      },
      swipeLeft(){
        this.$router.replace({path: 'demand'});
      }


    }
  }

  </script>

  <style>
  </style>
