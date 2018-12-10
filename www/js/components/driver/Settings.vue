<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-list>
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon large>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("profil")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("profil_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native="profile()" icon ripple>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile avatar>
            <v-list-tile-avatar>
              <v-icon large>euro_symbol</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title @click="dev()">{{$t("paiement")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("paiement_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile @click.native.stop="dialLangue=true" avatar>
            <v-list-tile-avatar>
              <v-icon large>language</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("langue")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("langue_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native.stop="dialLangue=true" icon ripple>
                <v-flex row xs12>
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
                </v-flex>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile @click.native="disconnect()" logout>
            <v-list-tile-avatar>
              <v-icon large>logout</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("disconnect")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("disconnect_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native="disconnect()" icon ripple>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
    <db-menu></db-menu>
  </v-layout>
</template>

<script>
import Menu from "./Menu.vue";

export default {
  components: {
    "db-menu": Menu
  },
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
  methods: {
    dev() {
      alert("En cours de développement");
    },

    profile() {
      this.$router.push("/profile")
    },
    
    disconnect() {
      window.localStorage.removeItem("jwt");
      window.localStorage.removeItem("type");
      this.$router.replace("/");
    }
  }
};
</script>

<style scoped>
#card-choix-langue {
  padding-bottom: 1.5em;
}
</style>