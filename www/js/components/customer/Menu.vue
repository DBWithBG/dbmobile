<template>

  <v-bottom-nav class="test" color="primary" :value="true" :active.sync="element" app  >
      <v-btn dark flat value="left" to="/my-deliveries">
        <span>{{$t("courses")}}</span>
        <v-icon>history</v-icon>
      </v-btn>
    <v-btn dark flat value="main" to="/demand-choice">
      <span>{{$t("demande")}}</span>
      <v-icon>pan_tool</v-icon>
    </v-btn>
    <v-btn dark flat value="right" to="/settings">
      <span>{{$t("settings")}}</span>
      <v-icon>settings</v-icon>
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
