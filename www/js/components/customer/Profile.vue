<template>
  <div class="profile">
    <!-- Loading spinner -->
    <div v-if="loading">
      <back-header :message="$t('profil')"></back-header>
      <v-layout row justify-center>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
          </v-layout>
        </v-container>
      </v-layout>
    </div>

    <!-- Layout quand on a fetch les infos -->
    <div v-if="!loading">
      <back-header :message="$t('profil')"></back-header>

      <v-layout column>
        <!-- Top card -->
        <v-flex xs12 mt-2>
          <v-card>
            <v-card-title primary-title>
              <h3 class="headline">
                <v-icon v-if="type == 'customer'" left>perm_identity</v-icon>
                <v-icon v-if="type == 'driver'" left>drive_eta</v-icon>
                <span>{{first_name}} {{last_name}}</span>
              </h3>
            </v-card-title>
            <v-card-text>
              <span v-if="!accountIsConfirmed" class="red-dot"></span>
              <span v-else class="green-dot"></span>
              {{accountStatus}}
            </v-card-text>
          </v-card>
        </v-flex>

        <!-- Modif infos persos card -->
        <v-flex xs12 mt-2>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="subheading">{{$t('change_personal_information')}}</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form v-model="infosFormValid">
                <v-text-field
                  v-model="first_name"
                  :rules="[rules.required]"
                  prepend-icon="perm_identity"
                  :label="$t('first_name')"
                ></v-text-field>
                <v-text-field
                  v-model="last_name"
                  :rules="[rules.required]"
                  prepend-icon="perm_identity"
                  :label="$t('last_name')"
                ></v-text-field>
                <v-text-field
                  :rules="[rules.required, rules.min_phone]"
                  v-model="phone"
                  prepend-icon="phone"
                  :label="$t('phone_number')"
                ></v-text-field>
                <v-text-field
                  v-if="type == 'driver'"
                  type="number"
                  :rules="[rules.required]"
                  v-model="max_bags"
                  prepend-icon="card_travel"
                  :label="$t('max_bags')"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="updateInfos"
                :disabled="!infosFormValid"
                flat
                color="success"
              >{{$t('save')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- Modif email card -->
        <v-flex xs12 mt-2>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="subheading">{{$t('change_email')}}</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form v-model="emailFormValid">
                <v-text-field
                  :rules="[rules.required, rules.email_valid]"
                  v-model="email"
                  prepend-icon="mail"
                  type="email"
                  label="Email"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="updateEmail"
                :disabled="!emailFormValid"
                flat
                color="success"
              >{{$t('save')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <!-- Modif password card -->
        <v-flex xs12 mt-2>
          <v-card>
            <v-card-title primary-title>
              <div>
                <h3 class="subheading">{{$t('change_password')}}</h3>
              </div>
            </v-card-title>
            <v-card-text>
              <v-form v-model="passwordFormValid">
                <v-text-field
                  prepend-icon="vpn_key"
                  v-model="current_password"
                  :label="$t('current_password')"
                  :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required]"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
                <v-text-field
                  prepend-icon="vpn_key"
                  v-model="new_password"
                  :label="$t('new_password')"
                  :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required]"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                @click="updatePassword"
                :disabled="!passwordFormValid"
                right
                flat
                color="success"
              >{{$t('save')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <db-menu></db-menu>
  </div>
</template>

<script>
import BackHeader from "../BackHeader.vue";
import Menu from "./Menu.vue";
import Api from "../../api.js";

export default {
  components: {
    "back-header": BackHeader,
    "db-menu": Menu
  },

  data() {
    return {
      // Custo ou driver
      type: "",

      // Api object
      api: new Api(),

      // Loading while fetching data from server
      loading: true,

      // Are forms valid ?
      infosFormValid: true,
      emailFormValid: true,
      passwordFormValid: true,

      // Utils
      showPassword: false,

      // User infos + text field
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      current_password: "",
      new_password: "",
      max_bags: 10,
      emailIsConfirmed: false,
      driverIsOp: false,

      // Validation rules
      rules: {
        required: value => !!value || this.$i18n.t("required"),
        min_password: value =>
          typeof(value) != 'undefined' || value.length >= 6 || this.$i18n.t("min_password_length"),
        min_phone: value =>
          typeof(value) != 'undefined' || value.length >= 10 || this.$i18n.t("min_phone_length"),
        email_valid: v => /.+@.+/.test(v) || this.$i18n.t("email_not_valid")
      }
    };
  },

  computed: {
    accountStatus() {
      if (this.type == "customer") {
        if (!this.emailIsConfirmed) {
          return this.$i18n.t("email_not_confirmed");
        } else return this.$i18n.t("account_confirmed");
      } 
      
      else if (this.type == "driver") {
        if (!this.emailIsConfirmed) {
          return this.$i18n.t("email_not_confirmed");
        } 
        else if (!this.driverIsOp) {
          return this.$i18n.t("pjs_not_provided");
        }
        else return this.$i18n.t("account_confirmed");
      }
    },

    accountIsConfirmed() {
      if (this.type == "customer") {
        return this.emailIsConfirmed;
      } else if (this.type == "driver") {
        return this.emailIsConfirmed && this.driverIsOp;
      }
    }
  },

  methods: {
    updateInfos() {
      let self = this;

      if (this.type == "customer") this.updateCustomerInfos();
      else if (this.type == "driver") this.updateDriverInfos();
    },

    updateCustomerInfos() {
      let self = this;

      this.api
        .updateCustomerInfos(this.first_name, this.last_name, this.phone)
        .then(response => {
          this.$swal({
            type: "success",
            text: self.$i18n.t("informations_updated")
          });
        })
        .catch(error => {
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        });
    },

    updateDriverInfos() {
      let self = this;

      this.api
        .updateDriverInfos(
          this.first_name,
          this.last_name,
          this.phone,
          this.max_bags
        )
        .then(response => {
          this.$swal({
            type: "success",
            text: self.$i18n.t("informations_updated")
          });
        })
        .catch(error => {
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        });
    },

    updateEmail() {
      let self = this;

      this.api
        .updateEmail(this.email)
        .then(response => {
          this.$swal({
            type: "success",
            text: self.$i18n.t("email_updated")
          });
        })
        .catch(error => {
          console.log(JSON.stringify(error.response.data));
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t(error.response.data.error.email[0])
          });
        });
    },

    updatePassword() {
      let self = this;

      this.api
        .updatePassword(this.current_password, this.new_password)
        .then(response => {
          this.$swal({
            type: "success",
            text: self.$i18n.t("password_updated")
          });
        })
        .catch(error => {
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t(error.response.data.error)
          });
        });
    },

    fetchCustomerData() {
      let self = this;

      // Fetch user's data from server
      this.api
        .readCustomer()
        .then(response => {
          self.loading = false;
          let customer = JSON.parse(response.data)[0];
          self.first_name = customer.surname;
          self.last_name = customer.name;
          self.phone = customer.phone;
          self.email = customer.user.email;
          self.emailIsConfirmed = customer.user.is_confirmed == 1;
        })
        .catch(error => {
          self.loading = false;
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        });
    },

    fetchDriverData() {
      let self = this;

      // Fetch user's data from server
      this.api
        .readDriver()
        .then(response => {
          self.loading = false;
          let driver = JSON.parse(response.data)[0];
          console.log(driver);
          self.first_name = driver.surname;
          self.last_name = driver.name;
          self.phone = driver.phone;
          self.email = driver.user.email;
          self.max_bags = driver.max_bags;
          self.emailIsConfirmed = driver.user.is_confirmed == 1;
          self.driverIsOp = driver.is_op == 1;
        })
        .catch(error => {
          self.loading = false;
          this.$swal({
            type: "error",
            title: self.$i18n.t("oups"),
            text: self.$i18n.t("unable_to_retrieve_data_from_server")
          });
        });
    }
  },

  // Call when component is mounted
  mounted() {
    this.type = window.localStorage.getItem("type");
    if (this.type == "customer") this.fetchCustomerData();
    else if (this.type == "driver") this.fetchDriverData();
  }
};
</script>

<style scoped>
.red-dot {
  height: 0.8em;
  width: 0.8em;
  background-color: #e53935;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.4em;
  margin-right: 0.6em;
}

.green-dot {
  height: 0.8em;
  width: 0.8em;
  background-color: #3eb93a;
  border-radius: 50%;
  display: inline-block;
  margin-left: 0.4em;
  margin-right: 0.6em;
}
</style>