<template>
  <v-bottom-nav :value="true" :active.sync="element" fixed>
      <v-btn flat color="green darken-2" value="left" to="/courses-driver">
        <span>Mes courses</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn flat color="green darken-2" value="main" to="/demands">
      <span>Demandes</span>
      <v-icon>map</v-icon>
    </v-btn>
    <v-btn flat color="green darken-2" value="right" to="/courses">
      <span>Profil et paramètres</span>
      <v-icon>settings</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default{
  data(){
    return {
      element:'main',
    }
  },

}

</script>

<style>

body {
  padding-bottom:56px;
}

</style>
