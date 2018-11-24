<template>


  <div id="register">
    
    <v-container>
          <v-form v-model="valid" lazy-validation>
              <v-layout row wrap>
                  <v-flex xs12 v-if="error"><v-alert value="true" dismissible type="error">{{error}}</v-alert></v-flex>
                  
                  <v-flex xs12 mt-4 mb-4>
                    <h1 class="display-2">Deliverbag</h1>
                  </v-flex>
                  <v-flex xs12>
                      <v-text-field :rules="emailRules" v-model="email" type="email" label="Email"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                      <v-text-field v-model="password" type="password" :label="$t('password')"></v-text-field>
                  </v-flex>
                  <v-flex xs12 class="text-xs-center">
                    <v-btn :disabled="!valid" flat color="success" @click="login">{{$t('to_log_in')}}</v-btn>
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
                      <v-btn @click="register" flat small>{{$t('to_create_an_account')}}</v-btn>
                  </v-flex>

                  
                  
              </v-layout>
        </v-form>
    </v-container>

  </div>
</template>


<script>
export default {
    data: () => ({
        error: null,
        email: '',
        password: '',
        valid: false,
        emailRules: [
        v => !!v || "L'adresse mail est requise",
        v => /.+@.+/.test(v) || "L'addresse mail doit être valide"
      ],
    }),

    methods: {
        register() {
            this.$router.push({path: '/register-choice'})
        },

        login() {
            if (this.email.length == 0 || this.password.length == 0) return;
            // axios.post('api.blahblah').then()
            
            // Success
            this.$router.push({path: '/demand'})

            // Error
            //this.error = 'Email ou mot de passe invalide'
        }
    }
};
</script>


<style>
</style>
