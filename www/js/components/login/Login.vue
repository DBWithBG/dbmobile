<template>
  <div id="register">
    <v-container>
      <v-form v-model="valid" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12 mt-4 mb-4>
            <h1 class="display-2">Deliverbag</h1>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="emailRules" v-model="email" type="email" label="Email"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="[otherRules.required]" v-model="password" type="password" :label="$t('password')"></v-text-field>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <v-btn :disabled="!valid" flat color="success" @click="login">{{$t('to_log_in')}}</v-btn>
          </v-flex>

          <v-flex xs12 mt-3 mb-3>
            <v-divider></v-divider>
          </v-flex>

          <!--<v-flex xs12>
            <v-layout row wrap>
              <v-flex xs6>
                <v-btn block>Google</v-btn>
              </v-flex>

              <v-flex xs6>
                <v-btn block>Facebook</v-btn>
              </v-flex>
            </v-layout>
          </v-flex>-->
          <v-flex xs12 mt-4 class="text-xs-center">
            <v-btn @click="register" flat small>{{$t('to_create_an_account')}}</v-btn>
          </v-flex>
        </v-layout>
      </v-form>

      <v-dialog v-model="hasError">
        <v-card>
          <v-card-title class="headline">Erreur</v-card-title>

          <v-card-text>{{error}}</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" flat="flat" @click="hasError = false">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>


<script>

import axios from 'axios'

export default {
    data() {
        return {
            hasError: false,
            error: '',

            // Form data
            email: '',
            password: '',

            // Is the form valid ?
            valid: false,

            // Rules
            emailRules: [
                v => !!v || "L'adresse mail est requise",
                v => /.+@.+/.test(v) || "L'addresse mail doit être valide"
            ],

            otherRules: {
                required: value => !!value || this.$i18n.t('required')
            }
        }
    },

    mounted() {
        if (this.checkIfUserIsLoggedIn) {
            let type = window.localStorage.getItem('type')
            
            if (type == 'customer')
                this.$router.push({name: 'DemandChoice'})
            
            else if (type == 'driver')
                this.$router.push({name: 'DemandChoice'})
            
            else {
                // Le type est invalide, on clean tout
                window.localStorage.removeItem('type')    
                window.localStorage.removeItem('jwt')    
            }
        }
    },

    methods: {
        checkIfUserIsLoggedIn() {
            let jwt = window.localStorage.getItem('jwt')
            let type = window.localStorage.getItem('type')

            return !jwt || !type;
        },

        register() {
            this.$router.push({path: '/register-choice'})
        },

        login() {
            let self = this

            if (this.email.length == 0 || this.password.length == 0) return;
            // axios.post('api.blahblah').then()
            axios.post('http://dev-deliverbag.supconception.fr/mobile/login', 
                {
                    'email': this.email, 
                    'password': this.password
                }
            ).then((response) => {
                let type = response.data.type
                let jwt = response.data.token

                // L'authentification a échouée
                if (!type || !jwt) {
                    self.error = self.$i18n.t('invalid_credentials')
                    self.hasError = true
                } 
                // L'authentification a réussi
                else {
                    window.localStorage.setItem("jwt", jwt)
                    window.localStorage.setItem("type", type)
                    this.$router.push({path: '/demand-choice'})
                }
            }).catch((error) => {
                console.log(error)
                self.error = self.$i18n.t("unable_to_retrieve_data_from_server");
                self.hasError = true
            })
            
        

            // Error
            //this.error = 'Email ou mot de passe invalide'
        }
    }
};
</script>


<style>
</style>
