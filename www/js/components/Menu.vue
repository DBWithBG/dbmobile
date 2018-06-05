<template>

  <v-bottom-nav :value="true" :active.sync="element" fixed>

    <v-btn flat color="teal" value="history" to="/courses">
      <span>Mes courses</span>
      <v-icon>history</v-icon>

    </v-btn>

    <v-btn flat color="teal" value="demande" to="/demand">
        <span>Faire une </br> demande</span>
        <v-icon>favorite</v-icon>
    </v-btn>

    <v-btn flat color="teal" value="map" to="/demands">

      <span>Demandes clients</span>
      <v-icon>map</v-icon>

    </v-btn>

  </v-bottom-nav>
</template>

<script>

export default{

  data(){
    return {
      element:'demande'
    }
  }
}

</script>

<style scoped>
</style>
