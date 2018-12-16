<template>
  <div>
    <v-flex xs12>
      <v-card>
        <v-list class="margin" three-line>
          <v-list-tile avatar @click="profile">
            <v-list-tile-avatar>
              <v-icon color="primary" large>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("profil")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("profil_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar @click="alert_dev">
            <v-list-tile-avatar>
              <v-icon color="primary" large>euro_symbol</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("paiement")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("paiement_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click.native.stop="dialLangue=true" avatar>
            <v-list-tile-avatar>
              <v-icon color="primary" large>language</v-icon>
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
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click.native="dialogContact=true">
            <v-list-tile-avatar>
              <v-icon color="primary" large>contacts</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t('db_contact')}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t('db_contact_info')}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile @click.native="logout()">
            <v-list-tile-avatar>
              <v-icon color="primary" large>exit_to_app</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("disconnect")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("disconnect_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialogContact" max-width="auto">
      <v-card>
        <v-card-title class="subheading">{{$t('contact_db')}}</v-card-title>
        <v-layout column>
          <v-card-text class="text-xs-center">
            <v-btn flat color="primary" :href="tel_string">
              {{$t('call')}}
              <v-icon right large>call</v-icon>
            </v-btn>
          </v-card-text>

          <v-card-text class="text-xs-center">
            <v-btn flat color="primary" :href="email_string">
              {{$t('mail')}}
              <v-icon right large>mail</v-icon>
            </v-btn>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-dialog>
    <db-menu></db-menu>
  </div>
</template>

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

          <v-list-tile logout>
            <v-list-tile-avatar>
              <v-icon large>logout</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{$t("disconnect")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("disconnect_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native="logout()" icon ripple>
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
import Api from "../../api";

export default {
  components: {
    "db-menu": Menu
  },
  data() {
    return {
      dialLangue: false,
      dialogContact: false,
      langues: [
        { code: "fr", text: this.$i18n.t("fr") },
        { code: "en", text: this.$i18n.t("en") },
        { code: "es", text: this.$i18n.t("es") }
      ],
      tel_string: "tel: " + this.$i18n.t('db_tel'),
      email_string: "mailto: " + this.$i18n.t('db_email')
    };
  },
  methods: {
    alert_dev() {
      alert("En cours de développement ou en attente de précision");
    },

    profile() {
      this.$router.push({ name: "Profile" });
    },

    // On clean le localStorage
    // On redirige l'utilisateur sur l'écran de connexion
    async logout() {
      let api = new Api();
      try {
        await api.logout();
      } catch (error) {
      } finally {
        window.localStorage.removeItem("jwt");
        window.localStorage.removeItem("type");
        this.$router.replace("/");
      }
    }
  }
};
</script>

<style scoped>
#card-choix-langue {
  padding-bottom: 1.5em;
}
</style>