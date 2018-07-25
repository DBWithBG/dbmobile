
<template>

  <v-bottom-nav class="test" color="primary" :value="true" :active.sync="element" app  >
      <v-btn dark flat value="left" to="/courses">
        <span>{{$t("courses")}}</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn dark flat value="main" to="/demand">
      <span>{{$t("demande")}}</span>
      <v-icon>pan_tool</v-icon>
    </v-btn>
    <v-btn dark flat  value="right" to="/settings">
      <span>{{$t("settings")}}</span>
      <v-icon>settings</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default{
  data(){
    return {
      element:"main",
    }
  },

}

</script>
<i18n src='@/assets/trad.json'></i18n>
<style scoped>


</style>
