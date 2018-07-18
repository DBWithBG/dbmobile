<template>


  <div>


    <v-flex xs12>
      <v-card>

        <v-list three-line>

          <v-list-tile to="/demands" avatar>
            <v-list-tile-content >
              <v-list-tile-title>Switch côté chauffeur</v-list-tile-title>

            </v-list-tile-content>
          </v-list-tile>


          <v-list-tile to="/my-bags" avatar>
            <v-list-tile-avatar>
              <v-icon color="primary" large>work</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>{{$t("bagages")}}</v-list-tile-title>

              <v-list-tile-sub-title>{{$t("bagages_subt")}} </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>



          <v-list-tile @click.native="getProfile()" avatar >
            <v-list-tile-avatar>
              <v-icon color="primary" large>person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>{{$t("profil")}}</v-list-tile-title>
              <v-list-tile-sub-title >{{$t("profil_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>



          <v-list-tile avatar>
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
              <v-list-tile-title> {{$t("langue")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("langue_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn @click.native.stop="dialLangue=true" icon ripple>
                <v-flex row xs12>
                  <v-dialog v-model="dialLangue" max-width="290">
                    <v-card >
                      <v-card color="primary">
                        <v-card-title  color="primary" class="white--text">{{$t("choix_langue")}}</v-card-title>
                      </v-card>
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
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>

          <v-list-tile @click.native="dialogContact=true" >
            <v-list-tile-avatar>
              <v-icon color="primary" large>contacts</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>Contact</v-list-tile-title>
              <v-list-tile-sub-title>Informations pour contacter directement Deliverbag</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>


          <v-list-tile @click.native="disconnect()" >
            <v-list-tile-avatar>
              <v-icon color="primary" large>exit_to_app</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content >
              <v-list-tile-title>{{$t("disconnect")}}</v-list-tile-title>
              <v-list-tile-sub-title>{{$t("disconnect_sbt")}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>


        </v-list>
      </v-card>
    </v-flex>


    <v-dialog v-model="dialogContact" max-width="auto">
      <v-card>
        <v-card-title class="headline">{{$t('contact_db')}}</v-card-title>
        <v-layout column>

          <v-card-text class="text-xs-center">
            {{$t('tel_number')}} : {{$t('db_tel')}}
            <v-btn flat color="primary" @click.native="openTel()">
              <v-icon large>call</v-icon>
            </v-btn>
          </v-card-text>

          <v-card-text class="text-xs-center" >
            {{$t('email')}} : {{$t('db_email')}}
            <v-btn flat color="primary" @click.native="openMail()">
              <v-icon large>mail</v-icon>
            </v-btn>
          </v-card-text>
        </v-layout>
      </v-card>
    </v-dialog>
    <db-menu> </db-menu>
  </div>
</template>

<script>

export default{
  data(){
    return {
      dialLangue:false,
      dialogContact:false,
      langues:[
        {code : 'fr' ,text: this.$i18n.t("fr")},
        {code : 'en' ,text: this.$i18n.t("en")},
        {code : 'es' ,text: this.$i18n.t("es")}
      ]

    }
  },
  methods:{

    // redirection sur l'appli de messagerie selectionnée par le client
    openMail(){
      window.open('mailto:bordeaux@deliverbag.com', '_system');
    },

    // redirection sur l'écran d'appel
    openTel(){
      let tel = this.$i18n.t('db_tel').split(' ').join('');
      window.open('tel:' + tel, '_system');
    },

    // webview du profil détaillé de l'utilisateur
    getProfile(){
      let url = "http://dev-deliverbag.supconception.fr/customers/profile?mobile_token=" + localStorage.getItem('deviceId') ;
      let ref = window.open(url, '_blank', 'location=no,zoom=no');
      let tok = localStorage.getItem('deviceId');
      let t= '$("#chk_mobile_token").val("'+tok+'")';
      //  ref.executeScript( {code : t});
    },

    // on clean le cache contenant le keep login
    // on redirige l'utilisateur sur l'écran de connexion
    disconnect(){
      localStorage.removeItem('deviceId');
      this.$router.replace('/');

    }

  }
}

</script>
<i18n src='@/assets/trad.json'></i18n>
<style>
</style>
