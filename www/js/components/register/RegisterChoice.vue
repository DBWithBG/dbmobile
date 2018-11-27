<template>
  <div id="register">
    <back-header :message="$t('to_register')"></back-header>

    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card
            class="vh"
            color="green lighten-4"
            :to="{name :'RegisterCustomer'}"
          >
            <v-card-title primary-title>
              <div>
                <h3 class="headline">
                  {{$t('customer')}}
                </h3>
                <div>{{$t('customer_register_choice')}}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>

        <!--<v-flex md12>
          <v-card to="/register-driver" color="cyan darken-2" class="white--text">
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Chauffeur</h3>
                <div>Vous voulez devenir chauffeur et transporter les bagages de nos clients</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>-->
      </v-layout>
    </v-container>
  </div>
</template>


<script>

import BackHeader from '../BackHeader.vue'

export default {
  components: {
    'back-header': BackHeader
  }
}

</script>


<style>
</style>
