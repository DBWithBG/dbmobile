<template>
  <div id="register">
    <v-container>
      <v-form v-model="valid">
        <v-layout row wrap>
          <v-flex xs12 mt-4 mb-4>
            <h1 class="display-2">Deliverbag</h1>
          </v-flex>
          <v-flex xs12>
            <v-text-field :rules="emailRules" v-model="email" type="email" label="Email"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :rules="[otherRules.required]"
              v-model="password"
              :append-icon="showPassword ? 'visibility_off' : 'visibility'"
              :type="showPassword ? 'text' : 'password'"
              @click:append="showPassword = !showPassword"
              :label="$t('password')"
            ></v-text-field>
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
import axios from "axios";
import Api from "../../api.js";

export default {
  data() {
    return {
      api: null,

      hasError: false,
      error: "",

      // Form data
      email: "",
      password: "",
      showPassword: false,

      // Is the form valid ?
      valid: false,

      // Rules
      emailRules: [
        v => !!v || this.$i18n.t("email_required"),
        v => /.+@.+/.test(v) || this.$i18n.t("email_not_valid")
      ],

      otherRules: {
        required: value => !!value || this.$i18n.t("required")
      }
    };
  },

  mounted() {

    if (this.checkIfUserIsLoggedIn) {
      let type = window.localStorage.getItem("type");

      if (type == "customer") this.$router.push({ name: "DemandChoice" });
      else if (type == "driver") this.$router.push({ name: "DemandsDriver" });
      else {
        // Le type est invalide, on clean tout
        window.localStorage.removeItem("type");
        window.localStorage.removeItem("jwt");
      }
    }
  },

  methods: {
    checkIfUserIsLoggedIn() {
      let jwt = window.localStorage.getItem("jwt");
      let type = window.localStorage.getItem("type");

      return !jwt || !type;
    },

    register() {
      this.$router.push({ path: "/register-choice" });
    },

    login() {
      let self = this;

      Api.login(this.email, this.password)
        .then(response => {
          let type = response.data.type;
          let jwt = response.data.token;

          // L'authentification a échouée
          if (!type || !jwt) {
            self.$swal({
              type: "error",
              title: self.$i18n.t("fail"),
              text: self.$i18n.t("invalid_credentials")
            });
          }
          // L'authentification a réussi
          else {
            window.localStorage.setItem("jwt", jwt);
            window.localStorage.setItem("type", type);

            self.api = new Api(jwt);

            if (self.isCordovaSet()) {
              self.sendFirebaseToken();
            }

            if (type == "customer")
              this.$router.push({ path: "/demand-choice" });
            else if (type == "driver")
              this.$router.push({ path: "/demands-driver" });
          }
        })
        .catch(error => {
          console.log(error);
          self.$swal({
            type: "error",
            title: self.$i18n.t("fail"),
            text: self.$i18n.t("invalid_credentials")
          });
        });
    },

    isCordovaSet() {
      return typeof cordova != "undefined";
    },

    sendFirebaseToken() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      cordova.plugins.firebase.messaging.getToken().then(token => {
        console.log("Sending firebase token : " + token);
        self.api.refreshNotifyToken(token)
          .then(response => {})
          .catch(error => {
            console.log(JSON.stringify(error));
          });
      });
    }
  }
};
</script>


<style>
</style>
