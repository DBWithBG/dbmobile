<template>
  <div id="landing">
    <v-layout column>
      <v-flex text-xs-left xs12 class="landing-logo-container">
        <img class="landing-logo" src="img/logo.png">
      </v-flex>
      <v-flex text-xs-center xs12 class="landing-text-container">
        <span class="landing-head">{{$t('your_bags')}}</span>
        <br>
        <span class="landing-subhead">{{$t('our_mission')}}</span>
      </v-flex>
      <v-flex text-xs-center xs12 class="landing-letsgo-button">
        <v-btn @click="begin" large color="primary">{{$t('begin')}}</v-btn>
      </v-flex>
    </v-layout>

    <div class="lang-btn-container">
      <v-btn @click="dialLangue = true" icon color="white" flat> <v-icon>language</v-icon></v-btn>
    </div>

    <v-dialog v-model="dialLangue" max-width="290">
      <v-card id="card-choix-langue">
        <v-card-title>{{$t("choix_langue")}}</v-card-title>
        <v-layout row>
          <v-flex xs10 offset-xs1>
            <v-select
              :items="langues"
              v-model="$root.$i18n.locale"
              single-line
              menu-props="auto"
              hide-details
              item-text="text"
              item-value="code"
            ></v-select>
          </v-flex>
          <v-spacer></v-spacer>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialLangue: false,
      langues: [
        { code: "fr", text: this.$i18n.t("fr") },
        { code: "en", text: this.$i18n.t("en") },
        { code: "es", text: this.$i18n.t("es") }
      ]
    };
  },

  mounted() {
    if (localStorage.getItem("jwt")) {
      this.$router.push("/login");
    }
  },

  methods: {
    begin() {
      this.$router.push("/login");
    }
  }
};
</script>
<style scoped>
/* Logo */
.landing-logo-container {
  margin-top: 2vh;
  margin-left: 10px;
}

.landing-logo {
  height: 55px;
}

/* Text */
.landing-text-container {
  margin-top: 22vh;
}

.landing-head {
  text-transform: uppercase;
  font-size: 32px;
  font-family: "Raleway", sans-serif;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #fff;
}

.landing-subhead {
  text-transform: uppercase;
  font-size: 22px;
  font-family: "Raleway", sans-serif;
  color: #fff;
  letter-spacing: 0.04em;
}

/* buttons */
.landing-letsgo-button {
  margin-top: 18vh;
  font-size: 20px !important;
}

.lang-btn-container {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

#card-choix-langue {
  padding-bottom: 1.5em;
}
</style>
