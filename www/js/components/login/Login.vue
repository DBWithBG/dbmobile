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

          <v-flex xs6>
            <v-btn @click="googleLogin" color="white" block>Google</v-btn>
          </v-flex>

          <v-flex xs6>
            <v-btn @click="facebookLogin" color="white" block>Facebook</v-btn>
          </v-flex>

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
      let self = this;

      if (
        typeof cordova != "undefined" &&
        typeof cordova.plugins != "undefined"
      ) {
        console.log("Registering onMessage callback");
        cordova.plugins.firebase.messaging.onMessage(function(payload) {
          let title = payload.gcm.title;
          let body = payload.gcm.body;
          self.$swal({
            type: "info",
            title: title,
            text: body
          });
        });
      }
      this.redirectLoggedUser();
    }
  },

  methods: {
    googleLogin() {
      window.plugins.googleplus.login({
        'webClientId': '607137533381-nktajtp63d841gtsicvp81anr84v0ia3.apps.googleusercontent.com',
        'offline': true
      },
        function(obj) {
          console.log("Success");
          alert(JSON.stringify(obj)); // do something useful instead of alerting
          console.log(obj.accessToken);
          console.log('------------');
          console.log(obj.idToken);
          console.log('------------');
          console.log(obj.serverAuthCode);
        },
        function(msg) {
          console.log("Error");
          alert("error: " + msg);
        }
      );
    },

    facebookLogin() {
      facebookConnectPlugin.login(["public_profile", "email"], userData => {
        console.log('-----FACEBOOK-------');
        console.log("UserInfo: " + JSON.stringify(userData));
        facebookConnectPlugin.getAccessToken(token => {
          console.log("Token: " + token);
        });
      }, error => {
        console.log("Error : " + JSON.stringify(error));
      });
    },

    checkIfUserIsLoggedIn() {
      let jwt = window.localStorage.getItem("jwt");
      let type = window.localStorage.getItem("type");

      return !jwt || !type;
    },

    async redirectLoggedUser() {
      let self = this;
      let type = window.localStorage.getItem("type");

      let api = new Api();

      if (type == "customer") {
        try {
          let response = await api.readCustomer();
          let customer = JSON.parse(response.data)[0];
          let emailIsConfirmed = customer.user.is_confirmed == 1;
          if (emailIsConfirmed) {
            self.$router.push({ name: "DemandChoice" });
          } else {
            self.$router.push({ name: "ConfirmEmail" });
          }
        } catch (error) {
          self.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        }
      } else if (type == "driver") {
        try {
          let response = await api.readDriver();
          let driver = JSON.parse(response.data)[0];
          let emailIsConfirmed = driver.user.is_confirmed == 1;
          let driverIsOp = driver.is_op == 1;
          if (emailIsConfirmed && driverIsOp) {
            self.$router.push({ name: "DemandsDriver" });
          } else {
            self.$router.push({ name: "ConfirmDriver" });
          }
        } catch (error) {
          self.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        }
      } else {
        // Le type est invalide, on clean tout
        window.localStorage.removeItem("type");
        window.localStorage.removeItem("jwt");
        self.$router.push({ name: "Login" });
      }
    },

    register() {
      this.$router.push({ path: "/register-choice" });
    },

    async login() {
      let self = this;

      try {
        let response = await Api.login(this.email, this.password);
        let type = response.data.type;
        let jwt = response.data.token;

        // L'authentification a échouée
        if (!type || !jwt) {
          self.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("invalid_credentials")
          });
        }
        // L'authentification a réussi
        else {
          window.localStorage.setItem("jwt", jwt);
          window.localStorage.setItem("type", type);

          if (self.isCordovaSet()) {
            this.sendFirebaseToken();
          }

          self.redirectLoggedUser();
        }
      } catch (error) {
        console.log(error);
        self.$swal({
          type: "error",
          title: self.$i18n.t("oups"),
          text: self.$i18n.t("invalid_credentials")
        });
      }
    },

    isCordovaSet() {
      return typeof cordova != "undefined";
    },

    async sendFirebaseToken() {
      let jwt = window.localStorage.getItem("jwt");
      let api = new Api();

      try {
        let token = await cordova.plugins.firebase.messaging.getToken();
        await api.refreshNotifyToken(token);
      } catch (error) {
        // On utilise stringify sur l'erreur pour pouvoir debug via les logs android
        console.log("Error in sendFirebaseToken : " + JSON.stringify(error));
      }
    }
  }
};
</script>


<style>
</style>
