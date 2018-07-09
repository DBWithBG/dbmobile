<template>
  <v-bottom-nav :value="true" :active.sync="element" fixed>
      <v-btn flat color="primary" value="left" to="/courses-driver">
        <span>Mes courses</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn flat color="primary" value="main" to="/demands">
      <span>Demandes</span>
      <v-icon>map</v-icon>
    </v-btn>
    <v-btn flat color="primary" value="right" to="/settings-driver">
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
