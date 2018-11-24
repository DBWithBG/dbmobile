<template>


  <div id="register">
    
    <v-container>
          <v-form>
              <v-layout row wrap>
                  <v-flex xs12 mt-4 mb-4>
                    <h1 class="display-2">Deliverbag</h1>
                  </v-flex>
                  <v-flex xs12>
                      <v-text-field label="Email"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                      <v-text-field type="password" label="Mot de passe"></v-text-field>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn flat color="success" @click="login">Se connecter</v-btn>
                  </v-flex>

                  <v-flex xs12 mt-3 mb-3>
                      <v-divider></v-divider>
                  </v-flex>

                  <v-flex xs12>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-btn block>Google</v-btn>
                        </v-flex>

                        <v-flex xs6>
                            <v-btn block>Facebook</v-btn>
                        </v-flex>
                    </v-layout>    
                  </v-flex>


                  <v-flex xs12 mt-4 class="text-xs-center">
                      <v-btn @click="register" flat small>Créer un compte</v-btn>
                  </v-flex>

                  
                  
              </v-layout>
        </v-form>
    </v-container>

  </div>
</template>


<script>
export default {
    methods: {
        register() {
            this.$router.push({path: '/register-choice'})
        },

        login() {
            this.$router.push({path: '/demand'})
        }
    }
};
</script>


<style>
</style>
