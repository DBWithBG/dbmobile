<template>
  <div id="register">
    <back-header :message="$t('to_register')"></back-header>

    <v-container>
      <v-form v-model="valid" lazy-validation>
        <v-layout row wrap>
          <v-flex xs12>
            <v-text-field
              prepend-icon="perm_identity"
              v-model="first_name"
              :label="$t('first_name')"
              :rules="[otherRules.required]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              prepend-icon="perm_identity"
              v-model="last_name"
              :label="$t('last_name')"
              :rules="[otherRules.required]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              prepend-icon="phone"
              v-model="phone_number"
              :label="$t('phone_number')"
              :rules="[otherRules.required, otherRules.min_phone]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              prepend-icon="mail"
              :rules="emailRules"
              v-model="email"
              type="email"
              label="Email"
            ></v-text-field>
          </v-flex>

          <v-flex xs12>
            <v-text-field
              prepend-icon="vpn_key"
              v-model="password"
              :label="$t('password')"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :rules="[otherRules.required, otherRules.min_password]"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 class="text-xs-center">
            <v-btn
              :disabled="!valid"
              flat
              large
              color="success"
              @click="register"
            >{{$t('to_register')}}</v-btn>
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
        </v-layout>
      </v-form>
    </v-container>
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
  </div>
</template>


<script>
import BackHeader from "../BackHeader.vue";
import axios from "axios";
import Api from "../../api.js";

export default {
  components: {
    "back-header": BackHeader
  },

  data: function() {
    return {
      hasError: false,
      error: "",
      showPassword: false,
      api: null,

      // Form value
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",

      // Is the form valid ?
      valid: false,

      // Rules
      emailRules: [
        v => !!v || this.$i18n.t("email_required"),
        v => /.+@.+/.test(v) || this.$i18n.t("email_not_valid")
      ],

      otherRules: {
        required: value => !!value || this.$i18n.t("required"),
        min_password: value =>
          value.length >= 6 || this.$i18n.t("min_password_length"),
        min_phone: value =>
          value.length >= 10 || this.$i18n.t("min_phone_length")
      }
    };
  },

  methods: {
    isCordovaSet() {
      return typeof cordova != "undefined";
    },

    sendFirebaseToken() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      cordova.plugins.firebase.messaging.getToken().then(token => {
        self.api
          .refreshNotifyToken(token)
          .then(response => {})
          .catch(error => {
            console.log(
              "Error in sendFirebasetoken : " + JSON.stringify(error)
            );
          });
      });
    },

    register() {
      let self = this;

      axios
        .post("https://dev-deliverbag.supconception.fr/mobile/register", {
          email: self.email,
          password: self.password,
          surname: self.first_name,
          name: self.last_name,
          phone: self.phone_number,
          type: "customer"
        })
        .then(response => {
          let type = response.data.type;
          let jwt = response.data.token;

          // L'inscription a échouée
          if (!type || !jwt) {
            console.log(response.data);
            if (
              response.data.email &&
              response.data.email[0].includes(
                "The email has already been taken"
              )
            ) {
              // L'email est déjà utilisée
              self.error = self.$i18n.t("email_already_been_taken");
            } else {
              // Message générique
              self.error = self.$i18n.t("error_while_registering");
            }

            self.hasError = true;
          }
          // L'inscription a réussi
          else {
            window.localStorage.setItem("jwt", jwt);
            window.localStorage.setItem("type", type);

            if (self.isCordovaSet()) {
              self.api = new Api();
              self.sendFirebaseToken();
            }

            self.$router.push({ name: "Login" });
          }
        })
        .catch(error => {
          console.log(error);
          self.error = self.$i18n.t("unable_to_retrieve_data_from_server");
          self.hasError = true;
        });
    }
  }
};
</script>


<style>
</style>
