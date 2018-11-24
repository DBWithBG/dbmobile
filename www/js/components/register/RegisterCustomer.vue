<template>


  <div id="register">

    <v-layout row>
        <v-flex xs12>
            <v-toolbar>
                <v-btn to="/register-choice" icon flat>
                    <v-icon >arrow_back </v-icon>
                </v-btn>
                <v-toolbar-title>{{$t('to_register')}} - {{$t('customer')}}</v-toolbar-title>
            </v-toolbar>
        </v-flex>
    </v-layout>
    
    <v-container>
          <v-form v-model="valid" lazy-validation>
              <v-layout row wrap>
                  <v-flex xs12 v-if="error"><v-alert value="true" dismissible type="error">{{error}}</v-alert></v-flex>

                  <v-flex xs12>
                      <v-text-field prepend-icon="perm_identity" v-model="first_name" :label="$t('first_name')"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                      <v-text-field prepend-icon="perm_identity" v-model="last_name" :label="$t('last_name')"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                      <v-text-field prepend-icon="phone" v-model="phone_number" :label="$t('phone_number')"></v-text-field>
                  </v-flex>
                  
                  <v-flex xs12>
                      <v-text-field prepend-icon="mail" :rules="emailRules" v-model="email" type="email" label="Email"></v-text-field>
                  </v-flex>

                  <v-flex xs12>
                      <v-text-field prepend-icon="vpn_key" v-model="password" type="password" :label="$t('password')"></v-text-field>
                  </v-flex>

                  <v-flex xs12 class="text-xs-center">
                    <v-btn :disabled="!valid" flat large color="success" @click="login">{{$t('to_register')}}</v-btn>
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
                  
              </v-layout>
        </v-form>
    </v-container>

  </div>
</template>


<script>
export default {
  data: function () {
      return {
            error: null,
            first_name: "",
            last_name: "",
            phone_number: "",
            email: "",
            password: "",
            valid: false,
            emailRules: [
                v => !!v || this.$i18n.t('email_required'),
                v => /.+@.+/.test(v) || this.$i18n.t('email_not_valid')
            ]
      }
  },

  methods: {
    register() {
      this.$router.push({ path: "/register-choice" });
    },

    login() {
      if (this.email.length == 0 || this.password.length == 0) return;
      // axios.post('api.blahblah').then()

      // Success
      this.$router.push({ path: "/demand" });

      // Error
      //this.error = 'Email ou mot de passe invalide'
    }
  }
};
</script>


<style>
</style>
