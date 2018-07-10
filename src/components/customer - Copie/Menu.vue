
<template>

  <v-bottom-nav :value="true" :active.sync="element" fixed>
      <v-btn flat color="green darken-2" value="left" to="/courses">
        <span>{{$t("courses")}} {{$i18n.locale}}</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn flat color="green darken-2" value="main" to="/demand">
      <span>{{$t("demande")}}</span>
      <v-icon>pan_tool</v-icon>
    </v-btn>
    <v-btn flat color="green darken-2" value="right" to="/settings">
      <span>{{$t("settings")}} </span>
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

<i18n>
{
  "fr": {
    "courses": "Mes demandes",
    "demande" : "Faire une demande",
    "settings" : "Profil et réglages"
  },
  "en": {
    "courses": "My requests",
    "demande" : "Make a request",
    "settings" : "Profile & Settings"
  }
}
</i18n>
