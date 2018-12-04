<template>
  <v-bottom-nav color="primary" :value="true" :active.sync="element" fixed>
    <v-btn dark value="left" to="/my-deliveries-driver">
      <span>{{$t("courses")}}</span>
      <v-icon>history</v-icon>
    </v-btn>
    <v-btn dark value="main" to="/demands-driver">
      <span>{{$t("demandes")}}</span>
      <v-icon>map</v-icon>
    </v-btn>
    <v-btn dark value="right" to="/settings-driver">
      <span>{{$t("settings")}}</span>
      <v-icon>settings</v-icon>
    </v-btn>
  </v-bottom-nav>
</template>

<script>
export default {
  data() {
    return {
      element: ""
    };
  }
};
</script>


<style>
body {
  padding-bottom: 56px;
}
</style>