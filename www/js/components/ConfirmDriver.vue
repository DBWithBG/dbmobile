<template>
  <div class="padding-top-2em">
    <v-container>
      <v-layout justify-center column fill-height>
        <v-flex class="text-xs-center">
          <span xs12 class="headline">{{$t('welcome_on_deliverbag')}}</span>
        </v-flex>
        <v-flex xs8 class="padding-top-2em">
          <v-divider></v-divider>
        </v-flex>
        <v-flex class="padding-top-2em">
          <span xs12 class="body-1">{{$t('confirm_your_email')}}</span>
        </v-flex>
        <v-flex class="padding-top-2em">
          <span xs12 class="body-1">{{$t('go_on')}}</span>
          <ul>
            <li class="body-1">{{$t('rib')}}</li>
            <li class="body-1">{{$t('cni')}}</li>
            <li class="body-1">{{$t('driving_license')}}</li>
          </ul>
        </v-flex>
        <v-flex class="padding-top-2em">
          <span xs12 class="body-1">{{$t('our_team_will_check')}}</span>
        </v-flex>
        <v-flex class="padding-top-2em text-xs-center">
          <v-btn @click="resendConfirmationEmail" color="info" block>{{$t('resend_email')}}</v-btn>
        </v-flex>
        <v-flex class="padding-top-1em text-xs-center">
          <v-btn @click="documents" color="success" block>{{$t('my_documents')}}</v-btn>
        </v-flex>
        <v-flex class="padding-top-1em text-xs-center">
          <v-btn @click="next" color="success" block>{{$t('next')}}</v-btn>
        </v-flex>
        <v-flex class="padding-top-1em text-xs-center">
          <v-btn @click="logout" color="error" block>{{$t('disconnect')}}</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Api from "../api.js";

export default {
  methods: {
    documents() {
      this.checkEmailConfirmed();
    },

    next() {
      this.checkDriverConfirmed();
    },

    async checkEmailConfirmed() {
      let self = this;
      let api = new Api();

      try {
        let response = await api.readDriver();
        let driver = JSON.parse(response.data)[0];
        let emailIsConfirmed = driver.user.is_confirmed == 1;
        if (emailIsConfirmed) {
          this.$router.push("/driver-documents");
        } else {
          self.$swal({
            type: "info",
            text: self.$i18n.t("email_not_confirmed")
          });
        }
      } catch (error) {
        console.log('Error in checkEmailConfirmed : ' + error);
        self.$swal({
          type: "error",
          title: self.$i18n.t("oups"),
          text: self.$i18n.t("unable_to_retrieve_data_from_server")
        });
      }
    },

    checkDriverConfirmed() {
      let self = this;
      let type = window.localStorage.getItem("type");
      let api = new Api();

      if (type == "driver") {
        api
          .readDriver()
          .then(response => {
            let driver = JSON.parse(response.data)[0];
            let emailIsConfirmed = driver.user.is_confirmed == 1;
            let driverIsOp = driver.is_op == 1;
            if (emailIsConfirmed && driverIsOp) {
              self.$router.push({ name: "DemandsDriver" });
            } else if (!emailIsConfirmed) {
              self.$swal({
                type: "info",
                text: self.$i18n.t("email_not_confirmed")
              });
            } else {
              self.$swal({
                type: "info",
                text: self.$i18n.t("driver_infos_not_provided")
              });
            }
          })
          .catch(_ => {
            self.$swal({
              type: "error",
              title: self.$i18n.t("oups"),
              text: self.$i18n.t("unable_to_retrieve_data_from_server")
            });
          });
      } else {
        // Le type est invalide, on clean tout
        window.localStorage.removeItem("type");
        window.localStorage.removeItem("jwt");
        self.$router.push({ name: "Login" });
      }
    },

    logout() {
      window.localStorage.removeItem("jwt");
      window.localStorage.removeItem("type");
      this.$router.replace("/");
    },

    async resendConfirmationEmail() {
      let api = new Api();
      try {
        await api.resendConfirmationEmail();
        this.$swal({
          type: "success",
          text: this.$i18n.t("confirmation_email_sent")
        });
      } catch (error) {
        console.log(error);
        this.$swal({
          type: "error",
          title: this.$i18n.t("oups"),
          text: this.$i18n.t("unable_to_retrieve_data_from_server")
        });
      }
    }
  }
};
</script>

<style scoped>
.padding-top-1em {
  padding-top: 1em;
}

.padding-top-2em {
  padding-top: 2em;
}

.body-1 {
  text-transform: none !important;
}
</style>

