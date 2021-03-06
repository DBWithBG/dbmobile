<template>
  <div id="register">
    <template>
      <v-tabs centered color="primary" dark icons-and-text>
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab href="#tab-1">
          {{$t('customer')}}
          <v-icon>perm_identity</v-icon>
        </v-tab>

        <v-tab href="#tab-2">
          {{$t('driver')}}
          <v-icon>drive_eta</v-icon>
        </v-tab>

        <v-tab-item v-for="i in 2" :id="'tab-' + i" :key="i">
          <!--  ========== Customer ========== -->
          <v-card v-if="i === 1" flat>
            <v-card-text>
              <v-form v-model="valid">
                <v-layout row wrap>
                  <v-flex xs12 mt-4 mb-4 text-xs-center>
                    <span class="subheading">{{$t('log_in_as_customer')}}</span>
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
                    <v-btn
                      :disabled="!valid"
                      block
                      color="primary"
                      @click="login"
                    >{{$t('to_log_in')}}</v-btn>
                  </v-flex>

                  <v-flex xs12 mt-3 mb-3>
                    <v-divider></v-divider>
                  </v-flex>

                  <v-flex class="google-button-container" xs6>
                    <v-btn @click="googleLogin('customer')" color="#E46F62" dark block>Google</v-btn>
                  </v-flex>

                  <v-flex class="facebook-button-container" xs6>
                    <v-btn @click="facebookLogin('customer')" color="#3B5998" dark block>Facebook</v-btn>
                  </v-flex>

                  <v-flex xs12 mt-4 class="text-xs-center">
                    <v-btn @click="register('customer')" flat small>{{$t('create_an_account')}}</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- ========== Driver ========== -->
          <v-card v-if="i === 2" flat>
            <v-card-text>
              <v-form v-model="valid">
                <v-layout row wrap>
                  <v-flex xs12 mt-4 mb-4 text-xs-center>
                    <span class="subheading">{{$t('log_in_as_driver')}}</span>
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
                    <v-btn
                      :disabled="!valid"
                      block
                      color="primary"
                      @click="login"
                    >{{$t('to_log_in')}}</v-btn>
                  </v-flex>

                  <v-flex xs12 mt-3 mb-3>
                    <v-divider></v-divider>
                  </v-flex>

                  <v-flex class="google-button-container" xs6>
                    <v-btn @click="googleLogin('driver')" color="#E46F62" dark block>Google</v-btn>
                  </v-flex>

                  <v-flex class="facebook-button-container" xs6>
                    <v-btn @click="facebookLogin('driver')" color="#3B5998" dark block>Facebook</v-btn>
                  </v-flex>

                  <v-flex xs12 mt-4 class="text-xs-center">
                    <v-btn @click="register('driver')" flat small>{{$t('create_an_account')}}</v-btn>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </template>
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
      email: "driver@driver.fr",
      password: "password",
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
    console.log('LOGIN MOUNTED');
    if (this.checkIfUserIsLoggedIn()) {
      console.log("User already logged in");
      this.registerOnMessageCallback();
      this.redirectLoggedUser();
    } else {
      console.log("User not logged in");
    }
  },

  methods: {
    registerOnMessageCallback() {
      let self = this;
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
    },

    async googleLogin(type) {
      let self = this;

      window.plugins.googleplus.login(
        {
          webClientId: "607137533381-nktajtp63d841gtsicvp81anr84v0ia3.apps.googleusercontent.com",
          offline: true
        },
        async function(obj) {
          let serverAuthToken = obj.serverAuthCode;
          try {
            let response = await Api.sendGoogleToken(type, serverAuthToken);
            let jwt = response.data.token;
            let backendType = response.data.type;

            console.log("Setting jwt in localStorage : " + jwt);
            window.localStorage.setItem("jwt", jwt);
            window.localStorage.setItem("type", backendType);
            if (self.isCordovaSet()) {
              self.sendFirebaseToken();
              self.registerOnMessageCallback();
            }
            self.redirectLoggedUser();
          } catch (error) {
            console.log("Error in googleLogin : " + error);
            self.$swal({
              type: "error",
              title: self.$i18n.t("error"),
              text: error
            });
          }
        },
        function(msg) {
          console.log("Error");
          alert("error: " + msg);
        }
      );
    },

    async facebookLogin(type) {
      let self = this;

      facebookConnectPlugin.login(
        ["public_profile", "email"],
        userData => {
          console.log("-----FACEBOOK-------");
          console.log("UserInfo: " + JSON.stringify(userData));
          facebookConnectPlugin.getAccessToken(async token => {
            console.log("Token: " + token);
            try {
              let response = await Api.sendFacebookToken(type, token);
              let jwt = response.data.token;
              let backendType = response.data.type;

              console.log("Setting jwt in localStorage : " + jwt);
              window.localStorage.setItem("jwt", jwt);
              window.localStorage.setItem("type", backendType);

              if (self.isCordovaSet()) {
                self.sendFirebaseToken();
                self.registerOnMessageCallback();
              }

              self.redirectLoggedUser();
            } catch (error) {
              console.log(
                "Error in facebookConnectPlugin.getAccessToken : " + error
              );
              self.$swal({
                type: "error",
                title: self.$i18n.t("error"),
                text: error
              });
            }
          });
        },
        error => {
          console.log("Error : " + JSON.stringify(error));
        }
      );
    },

    checkIfUserIsLoggedIn() {
      console.log("Check if user is logged in");
      let jwt = window.localStorage.getItem("jwt");
      let type = window.localStorage.getItem("type");
      return jwt && type;
    },

    async redirectLoggedUser() {
      let self = this;
      let type = window.localStorage.getItem("type");

      console.log("Redirecting logged user");

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
          console.log("Error in Login::redirectLoggedUser : " + error);
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

    register(type) {
      if (type === "customer") {
        this.$router.push({ path: "/register-customer" });
      } else {
        this.$router.push({ path: "/register-driver" });
      }
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
            this.registerOnMessageCallback();
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


<style scoped>
.google-button-container {
  padding: 4px;
}

.facebook-button-container {
  padding: 4px;
}

</style>
