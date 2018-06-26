<template>
  <v-bottom-nav :value="true" :active.sync="element" fixed>
      <v-btn flat color="green darken-2" value="left" to="/courses">
        <span>Mes courses</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn flat color="green darken-2" value="main" to="/demands">
      <span>Prendre une demande</span>
      <v-icon>pan_tool</v-icon>
    </v-btn>
    <v-btn flat color="green darken-2" value="right" to="/demands">
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

<style scoped>

</style>
