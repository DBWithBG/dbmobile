<template>
  <!--
  Ecran de chargement,
  ce qui est affiché lorsque l'on attend la récupération des données du serveur
  -->
  <div>
    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>

    <div v-if="!loading">
      <!-- Gestion des bagages -->
      <back-header :message="$t('bagages')"></back-header>

      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <!-- Gestion des bagages CABINE -->
          <v-btn
            round
            color="primary"
            @click.native="ajoutBagage('cabine')"
          >{{$t("bagages_ajout")}} {{$t("bagage_cabine")}}</v-btn>
          <div v-for="bag in bagagesCabine" :key="bag.id">
            <v-layout row>
              <v-flex xs2>
                <v-btn icon flat color="error" @click.native="supprBagage(bagagesCabine, bag)">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  required
                  v-bind:label="$t('bagage_nom')"
                  v-model="bag.name"
                  :rules="[() => bag.name.length > 0 || $t('bagage_required')]"
                ></v-text-field>
              </v-flex>
              <v-divider vertical></v-divider>
              <v-flex xs5>
                <v-text-field v-bind:label="$t('bagage_descr')" v-model="bag.details"></v-text-field>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>

      <!-- Gestion des bagages SOUTE -->
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-btn
            round
            color="primary"
            @click.native="ajoutBagage('soute')"
          >{{$t("bagages_ajout")}} {{$t("bagage_soute")}}</v-btn>
          <div v-for="bag in bagagesSoute" :key="bag.id">
            <v-layout row>
              <v-flex xs2>
                <v-btn icon flat color="error" @click.native="supprBagage(bagagesSoute, bag)">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  required
                  v-bind:label="$t('bagage_nom')"
                  v-model="bag.name"
                  :rules="[() => bag.name.length > 0 || $t('bagage_required')]"
                ></v-text-field>
              </v-flex>
              <v-divider vertical></v-divider>
              <v-flex xs5>
                <v-text-field v-bind:label="$t('bagage_descr')" v-model="bag.details"></v-text-field>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>

      <!-- Gestion des bagages AUTRE -->
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-btn
            round
            color="primary"
            @click.native="ajoutBagage('autre')"
          >{{$t("bagages_ajout")}} {{$t("bagage_autre")}}</v-btn>
          <div v-for="bag in bagagesAutre" :key="bag.id">
            <v-layout row>
              <v-flex xs2>
                <v-btn icon flat color="error" @click.native="supprBagage(bagagesAutre, bag)">
                  <v-icon>clear</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  required
                  v-bind:label="$t('bagage_nom')"
                  v-model="bag.name"
                  :rules="[() => bag.name.length > 0 || $t('bagage_required')]"
                ></v-text-field>
              </v-flex>
              <v-divider vertical></v-divider>
              <v-flex xs5>
                <v-text-field v-bind:label="$t('bagage_descr')" v-model="bag.details"></v-text-field>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>

      <!-- On active le bouton de validation si l'utilisateur
      a correctement rempli les infos des bagages-->
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-btn
            round
            dark
            :disabled="!verifBagage()"
            color="action"
            @click.native="updateBagages()"
          >Mettre à jour mes bagages</v-btn>
        </v-flex>
      </v-layout>

      <db-menu></db-menu>

      <v-snackbar v-model="snackbar" color="primary" bottom>{{$t('snackbar_bags_update')}}</v-snackbar>

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

      <v-dialog v-model="hasSuccess">
        <v-card>
          <v-card-title class="headline">{{$t('success')}}</v-card-title>

          <v-card-text>{{success}}</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="hasSuccess = false">Fermer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import BackHeader from "../BackHeader.vue";
import Menu from "./Menu.vue";

export default {
  components: {
    "back-header": BackHeader,
    "db-menu": Menu
  },

  data() {
    return {
      bagagesCabine: [],
      bagagesSoute: [],
      bagagesAutre: [],
      // boolean utilisé pour éviter les conflits liés à l'update des bagages
      connecting: false,
      snackbar: false,
      loading: true,

      hasError: false,
      hasSuccess: false,
      error: "",
      success: ""
    };
  },

  created() {
    // on récupère les bagages de l'utilisateur
    this.getBagages();
  },

  methods: {
    // on récupère les bagages d'un user grâce à son mobile token
    getBagages() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      axios
        .get("https://dev-deliverbag.supconception.fr/mobile/bags/users", {
          headers: {
            Authorization: "Bearer " + jwt
          }
        })
        .then(response => {
          let data = response.data;
          self.connecting = true;
          self.bagagesCabine = [];
          self.bagagesSoute = [];
          self.bagagesAutre = [];
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              console.log(JSON.stringify(data[i]));
              switch (data[i].type_id) {
                case 1:
                  self.bagagesCabine.push(data[i]);
                  break;
                case 2:
                  self.bagagesSoute.push(data[i]);
                  break;
                case 3:
                  self.bagagesAutre.push(data[i]);
                  break;
              }
            }
          }
          self.loading = false;
          self.connecting = false;
        })
        .catch(error => {
          console.log(error);
          self.connecting = false;
          self.loading = false;
          self.error = self.$i18n.t("unable_to_retrieve_data_from_server");
          self.hasError = true;
        });
    },

    // Méthode d'ajout de bagage, en fonction du type de ce dernier
    ajoutBagage(type) {
      switch (type) {
        case "cabine":
          this.bagagesCabine.push({ name: "" + "", details: "" });
          break;
        case "soute":
          this.bagagesSoute.push({ name: "" + "", details: "" });
          break;
        case "autre":
          this.bagagesAutre.push({ name: "" + "", details: "" });
          break;
      }
    },

    // on supprime le bagage correspondant dans le tableau
    supprBagage(array, obj) {
      let index = array.indexOf(obj);
      if (index > -1) {
        array.splice(index, 1);
      }
    },

    // méthode de mise à jour des bagages
    // j'envoie les différents bagages en fonction de leur type + le mobile token du client
    updateBagages() {
      let data = {
        bagages: {
          "1": this.bagagesCabine,
          "2": this.bagagesSoute,
          "3": this.bagagesAutre
        }
      };

      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      axios
        .put(
          "https://dev-deliverbag.supconception.fr/mobile/bags/users",
          data,
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.getBagages();
          self.hasSuccess = true;
          self.success = self.$i18n.t("bagages_updated");
        })
        .catch(error => {
          alert(error);
          console.log(error);
          self.getBagages();
        });
    },

    verifBagage() {
      return (
        !this.connecting &&
        this.bagageOk(this.bagagesAutre) &&
        this.bagageOk(this.bagagesSoute) &&
        this.bagageOk(this.bagagesCabine)
      );
    },

    // il est nécessaire de nommer le bagage que l'on ajoute
    // cette méthode vérifie cette condition pour chaque bagage ajouté de chaque catégorie
    bagageOk(tab) {
      let noms = [];
      let ok = true;
      if (tab.length) {
        let self = this;
        for (let i = 0; i < tab.length; i++) {
          if (tab[i].name == "") {
            ok = false;
          } else {
            if (noms.includes(tab[i].name)) {
              ok = false;
            } else {
              noms.push(tab[i].name);
            }
          }
        }
      }
      return ok;
    }
  }
};
</script>
<style>
</style>