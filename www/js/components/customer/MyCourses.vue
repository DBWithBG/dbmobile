<template>

  <div class="margin">

    <!--
    Ecran de chargement,
    ce qui est affiché lorsque l'on attend la récupération des données du serveur
  -->
  <v-layout v-if="loading" row justify-center>
    <v-container fill-height>
      <v-layout row justify-center align-center>
        <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
      </v-layout>
    </v-container>
  </v-layout>

  <div v-if="!loading" v-touch="{
    left:swipeLeft
    }">

    <!--
    Définition des différents onglets
  -->
  <v-tabs fixed-tabs slider-color="primary">
    <v-tab v-for="tab in tabs" :key="tab.id" >
      {{ tab }}
    </v-tab>
    
    <v-tabs-items :v-model="tabs">

      
      
      <v-tab-item
      v-for="tab in demandes" :key="tab.id" >

      
      
      <v-data-table :headers="headers" :items="tab" hide-actions class="elevation-1" hide-headers>
        
        <template slot="items" slot-scope="props">
          
          <v-expansion-panel>
            <v-expansion-panel-content>

              <!--  Partie CONCERNANT LE HEADER DU PANEL (ce qui est toujours visible)-->
            <div slot="header">
              {{$t("suivi_course")}} {{moment(props.item.start_date).format('LLL')}} <b>{{props.item.price}}€</b>
            </div>

            <!-- Contenu du panel lorsqu'il est étendu -->
            

          <!-- slider de suivi de la course -->
          <div v-if="props.item.status === 2 || props.item.status === 3 || props.item.status === 4">
              <!-- pour récupérer le tracking du chauffeur, 2 champs dans l'objet : temps estimé et % d'avancement -->
              {{props.item.tracking}}
            <v-layout row xs12>
              <v-flex xs4>
                <v-subheader>Bagages en attente</v-subheader>
              </v-flex>
              <v-flex xs5>
                <v-subheader>Pris en charge</v-subheader>
              </v-flex>
              <v-flex xs3>
                <v-subheader>Livrés</v-subheader>
              </v-flex>
            </v-layout>
            <v-flex xs10 offset-xs1>
              <v-slider v-model="props.item.status" :max="3.0" :min="1.0" :step="0.1" readonly>
            </v-slider>
          </v-flex>
        </div>

        


        <v-layout row xs12>
          <v-flex class="text-xs-center" xs4 offset-xs1>
            {{ props.item.start_position.address}}
            <v-divider> </v-divider>
            <b>{{moment(props.item.start_date).format('LLL')}}</b>
          </v-flex>
          <v-flex xs1 class="arrow-flex">
            <v-icon align-center>arrow_forward</v-icon>
          </v-flex>
          <v-flex class="text-xs-center" xs4>
            {{props.item.end_position.address}}
            <v-divider> </v-divider>
            <div v-if="props.item.time_consigne">
              <b>{{moment(props.item.end_date).format('LLL')}}</b>
            </div>
            <div v-else>
              <b>{{$t('livraison_asap')}}</b>
            </div>
          </v-flex>
        </v-layout>

        

        <br>
        <!--
        Notation de la course SI elle a déjà été effectuée
      -->

      <div v-if="props.item.status === 5 && props.item.rating != null && props.item.rating.details=='' ">
        <v-layout row>
          <v-flex xs10 offset-xs2>
            <star-rating
            :star-size="40"
            v-model="props.item.rating.rating" :show-rating="false"
            @click.native.stop="active=props.item,dialogRating = true,sendRating(props.item.id,props.item.rating.rating)" >
          </star-rating>
        </v-flex>
      </v-layout>
    </div>

    <div v-if="props.item.status === 5 && props.item.rating == null">
      <v-layout row>
        <v-flex xs10 offset-xs2>
          <star-rating
          :star-size="40"
          v-model="props.item.rating2" :show-rating="false"
          @click.native.stop="active=props.item,dialogRating = true,sendRating(props.item.id,props.item.rating2)" >
        </star-rating>
      </v-flex>
    </v-layout>
  </div>



    <v-flex class="text-xs-center" row xs12 v-if="props.item.status === 1">
      <b>{{$t('en_attente_explication')}}</b>
    </v-flex>
    <v-flex class="text-xs-center" row xs12 v-if="props.item.status === 1">
      <v-btn flat color='error' @click.native.stop="active=props.item,dialogDel = true">
        <span> {{$t("cancel_course")}}</span>
      </v-btn>
    </v-flex>

    <v-flex row xs12 v-if="props.item.status === 5 && props.item.take_over_delivery.disputes.length <= 0">
      <v-btn flat color='error' @click.native.stop="active=props.item,dialogLitige = true">
        <span> {{$t('declarer_litige')}}</span>
      </v-btn>
    </v-flex>
  </v-expansion-panel-content>
</v-expansion-panel>
</template>

<!--
SLOT affiché lorsqu'il n'y a pas de données à afficher
-->

<template slot="no-data">
  {{$t('courses_empty')}}
</template>
</v-data-table>

</v-tab-item>
</v-tabs-items>
</v-tabs>

</div>

<!--
Dialog popup concernant l'annulation d'une course
-->

<v-dialog v-model="dialogDel" max-width="290">
  <v-card>
    <v-card-title class="headline">{{$t("cancel_course")}}</v-card-title>
    <v-layout row>
      <v-flex xs10 offset-xs1>
        <v-card-text>
          {{$t("delete_ask")}}
        </v-card-text>
        <v-card-text>
          {{$t("delete_info")}}
        </v-card-text>
      </v-flex>
    </v-layout>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="action" flat @click.native="dialogDel =false">
        <span> {{$t("cancel")}}</span>
      </v-btn>
      <v-btn color="error" flat @click.native="dialogDel=false,cancelDelivery(active.id)">
        <span> {{$t("delete")}}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!--
Dialog popup concernant la notation d'une course
-->

<v-dialog v-model="dialogRating" max-width="290">
  <v-card>
    <v-card-title class="headline">{{$t("rating")}}</v-card-title>
    <v-layout row>
      <v-flex v-if="active.rating" xs10 offset-xs1>
        <v-textarea clearable rows="1" auto-grow v-bind:label="$t('rating_label')" v-model="active.rating.details"> </v-textarea>
        <v-btn  flat color="primary" @click.native="sendRating(active.id,active.rating.rating,active.rating.details),dialogRating = false">
          <span>{{$t("rating_button")}}</span>
        </v-btn>
      </v-flex>
      <v-flex v-else xs10 offset-xs1>
        <v-textarea clearable rows="1" auto-grow v-bind:label="$t('rating_label')" v-model="active.details"> </v-textarea>
        <v-btn  flat color="primary" @click.native="sendRating(active.id,active.rating2,active.details),dialogRating = false">
          <span>{{$t("rating_button")}}</span>
        </v-btn>
      </v-flex>
    </v-layout>

  </v-card>
</v-dialog>

<!--
Dialog popup concernant la déclaration d'un litige d'une course
-->

<v-dialog v-model="dialogLitige" max-width="290">
  <v-card>
    <v-card-title class="headline">{{$t("declaration_litige")}}</v-card-title>
    <v-layout row>
      <v-flex xs10 offset-xs1>
        <v-textarea clearable rows="1" auto-grow v-bind:label="$t('litige_label')" v-model="litigeText"> </v-textarea>
      </v-flex>
    </v-layout>
    <v-btn :disabled="litigeText==''" flat color="primary" @click.native="sendLitige(active.id,litigeText),dialogLitige = false">
      <span>{{$t('declarer_litige')}}</span>
    </v-btn>
  </v-card>
</v-dialog>


<v-snackbar v-model="snackbarRating" color="primary" bottom>
  {{$t('snackbar_rating')}}
</v-snackbar>

<v-snackbar v-model="snackbarLitige" color="primary" bottom>
  {{$t('snackbar_litige')}}
</v-snackbar>

<v-dialog v-model="hasError">
      <v-card>
        <v-card-title class="headline">Erreur</v-card-title>

        <v-card-text>
          {{error}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" @click="hasError = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<db-menu> </db-menu>
</div>

</template>


<script>
import Menu from "./Menu.vue";
import axios from "axios";

export default {
  components: {
    "db-menu": Menu
  },

  data() {
    return {
      hasError: false,
      error: "",

      // pour savoir si les données sont chargées
      loading: true,

      // correspond à la course sélectionnée
      active: "",

      // différents headers de la data table
      headers: [
        { text: this.$i18n.t("distance"), value: "distance" },
        { text: this.$i18n.t("prix"), value: "price" },
        { text: this.$i18n.t("temps_estime"), value: "estimated_time" }
      ],

      // dialog notation ouvert?
      dialogRating: false,

      // dialog litige ouvert?
      dialogLitige: false,

      // dialog suppression de course ouvert?
      dialogDel: false,

      // label des onglets
      tabs: [
        this.$i18n.t("tab_en_cours"),
        this.$i18n.t("tab_en_attente"),
        this.$i18n.t("tab_passees")
      ],

      // données récupérées du serveur que l'on stocke ensuite dans des arrays
      demandes: [[], [], []],

      // correspond au texte du litige
      litigeText: "",

      // snackbar rating envoyé
      snackbarRating: false,

      // snackbar litige envoyé
      snackbarLitige: false
    };
  },

  // Ce qui est effectué dès que la page est créée
  created() {
    // On récupère les deliveries du client correspondant
    this.getDeliveries();
  },

  methods: {
    getDeliveries() {
      //TODO:  GET LE PHONE NUMBER DU CHAUFFEUR POUR QUE LE CLIENT PUISSE LE Contacter
      // pareil pour côté chauffeur du coup !
      let self = this;
      this.demandes = [[], [], []];
      $.ajax({
        type: "GET",
        url: "https://dev-deliverbag.supconception.fr/mobile/deliveries/customers",
        datatype: "jsonp",
        beforeSend: function(request) {
          request.setRequestHeader("Authorization", 'Bearer ' + window.localStorage.getItem('jwt'));
        },
        success: function(data) {
          console.log(data)

          // Les demandes à l'index 0 correspondent à celles en cours :
          // Dans la base, ce sont les indexs 2,3 et 4 qui correspondent respectivement à
          // 'PRIS EN CHARGE' / 'EN COURS DE LIVRAISON' / 'EN CONSIGNE'
          self.demandes[0].push.apply(self.demandes[0], data[2]);
          self.demandes[0].push.apply(self.demandes[0], data[3]);
          self.demandes[0].push.apply(self.demandes[0], data[4]);
          // Les demandes à l'index 1 correspondent à celles en attente de prise en charge :
          // Dans la base, c'est l' index 1 qui correspond à
          // 'EN ATTENTE DE PRISE EN CAHRGE'
          self.demandes[1].push.apply(self.demandes[1], data[1]);
          // Les demandes à l'index 2 correspondent à celles en attente de prise en charge :
          // Dans la base, c'est l'index 5 qui correspond à
          // 'TERMINÉ'
          self.demandes[2].push.apply(self.demandes[2], data[5]);
          self.loading = false;
          console.log(self.demandes[1])
          self.$forceUpdate();
        },
        error: function(e) {
          console.error('Error in getDeliveries')
          console.log(e);
          self.error = self.$i18n.t("unable_to_retrieve_data_from_server");
          self.loading = false;
          self.hasError = true;
        }
      });
    },

    // méthode pour annuler une demande
    // params : id de la delivery + mobile token pour vérifier que c'est un client
    cancelDelivery(id) {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      axios.post("https://dev-deliverbag.supconception.fr/mobile/customers/deliveries/cancelDelivery", {
        delivery_id: id
      }, {
        headers: {
          Authorization: 'Bearer ' + jwt
        }
      }).then(response => {
        let data = response.data;
        self.demandes = [[], [], []];
        self.getDeliveries();
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
    },

    // méthode pour envoyer la notation d'une course
    // params : id de la delivery, mobile token du client, note attribuée et commentaire FACULTATIF
    sendRating(id, rating, com) {
      let self = this;

      // si il y'a un commentaire, alors l'utilisateur ne peut pas à nouveau envoyer la notation

      $.ajax({
        url: "http://dev-deliverbag.supconception.fr/mobile/deliveries/ratings",
        type: "POST",
        data: {
          delivery_id: id,
          mobile_token: localStorage.getItem("deviceId"),
          rating: rating,
          details: com
        },
        success: function(data) {
          self.snackbarRating = true;
          if (com != undefined) {
            self.getDeliveries();
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
    },

    // méthode pour envoyer la notation d'une course
    // params : id de la delivery, mobile token du client, et commentaire OBLIGATOIRE
    sendLitige(id, com) {
      console.log(com);
      let self = this;

      $.ajax({
        url:
          "http://dev-deliverbag.supconception.fr/mobile/deliveries/disputes",
        type: "POST",
        data: {
          delivery_id: id,
          mobile_token: localStorage.getItem("deviceId"),
          reason: com
        },
        success: function(data) {
          self.snackbarLitige = true;
          self.litigeText = "";
          self.getDeliveries();
        },
        error: function(e) {
          console.log(e);
        }
      });
    },

    // définition de l'action du swipe
    swipeLeft() {
      this.$router.replace({ path: "demand" });
    },

    // webview pour avoir le détail d'une course
    // param : id de la course
    detailsCourse(id) {
      let jwt = window.localStorage.getItem("jwt");
      let ref = window.open(
        "https://dev-deliverbag.supconception.fr/mobile/deliveries/" + id + '?token=' + jwt,
        "_blank",
        "location=no,zoom=no"
      );
    }
  }
};
</script>

<style>
tbody {
  display: block;
}


.margin {
  margin-bottom: 56px;
}

.arrow-flex {
  margin: 1em;
}
</style>