<template>
  <div id="confirm-email">
    <v-layout justify-center column fill-height>
        <v-flex class="text-xs-center"><span xs12 class="headline">{{$t('welcome_on_deliverbag')}}</span></v-flex>
        <v-flex class="padding-top text-xs-center"><span xs12 class="subheading">{{$t('confirm_your_email')}}</span></v-flex>
        <v-flex class="padding-top text-xs-center"><v-btn flat>Renvoyer l'email</v-btn></v-flex>
        <v-flex class="padding-top text-xs-center"><v-btn flat>Continuer</v-btn></v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>

#confirm-email {
    padding-top: 7em;
}

.padding-top {
    padding-top: 5em;
}

</style>

