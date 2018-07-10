<template>


  <v-layout row>


    <v-flex xs12 sm6 offset-sm3>
      <v-card>

        <v-list three-line>

          <v-list-tile to="/demands" avatar>
            <v-list-tile-content >
              <v-list-tile-title>Switch côté chauffeur</v-list-tile-title>

            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn to="/demands" icon ripple>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>


          <v-list-tile to="/my-bags" avatar>
            <v-list-tile-avatar>
              <v-icon large>work</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>{{$t("bagages")}}</v-list-tile-title>

              <v-list-tile-sub-title>{{$t("bagages_subt")}} </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn to="/my-bags" icon ripple>
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-divider></v-divider>

          <v-list-tile @click.native="getProfile()" avatar >
            <v-list-tile-avatar>
              <v-icon large>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>{{$t("profil")}}</v-list-tile-title>
              <v-list-tile-sub-title >{{$t("profil_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native="getProfile()" icon ripple>
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
              <v-list-tile-title>{{$t("paiement")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("paiement_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native="" icon ripple>
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
              <v-list-tile-title> {{$t("langue")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("langue_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native.stop="dialLangue=true" icon ripple>
                <v-flex row xs12>
                  <v-dialog v-model="dialLangue" max-width="290">
                    <v-card>
                      <v-card-title class="headline">{{$t("choix_langue")}}</v-card-title>
                      <v-layout row>
                        <v-flex xs10 offset-xs1>
                          <v-select
                          :items="langues"
                          v-model="$root.$i18n.locale"
                          single-line
                          auto
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

        </v-list>
      </v-card>
    </v-flex>
    <db-menu> </db-menu>
  </v-layout>
</template>

<script>

export default{
  data(){
    return {
      dialLangue:false,
      langues:[
      {code : 'fr' ,text: this.$i18n.t("fr")},
      {code : 'en' ,text: this.$i18n.t("en")}],
    }
  },
  methods:{


    getProfile(){
      let url = "http://dev-deliverbag.supconception.fr/customers/profile?mobile_token=" + localStorage.getItem('deviceId') ;
      let ref = window.open(url, '_blank', 'location=no,zoom=no');
      let tok = localStorage.getItem('deviceId');
      let t= '$("#chk_mobile_token").val("'+tok+'")';
    //  ref.executeScript( {code : t});
  },

  }
}

</script>
<i18n src='@/assets/trad.json'></i18n>
<style>
</style>
