
<template>
  <v-bottom-nav :value="true" :active.sync="element" fixed>
      <v-btn flat color="primary" value="left" to="/courses">
        <span> {{$t("courses")}}</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn flat color="primary" value="main" to="/demand">
      <span>{{$t("demande")}}</span>
      <v-icon>pan_tool</v-icon>
    </v-btn>
    <v-btn flat color="primary" value="right" to="/settings">
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
<i18n src='@/assets/trad.json'></i18n>
<style>


body {
  padding-bottom:56px;
}

</style>
