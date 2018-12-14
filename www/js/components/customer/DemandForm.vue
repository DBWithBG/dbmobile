<template>
  <div>
    <!-- header retourn arrière -->
    <back-header :message="$t('header')"></back-header>

    <!-- STEPPER Horizontal de progression-->
    <v-stepper v-model="step">
      <v-stepper-header>
        <!-- étape 1 : infos de prise en chagre et livraison -->
        <v-stepper-step :complete="step > 1" step="1">{{$t('subt_1')}}</v-stepper-step>
        <!-- étape 2 : infos de bagages-->
        <v-stepper-step :complete="step > 2" step="2">{{$t('subt_2')}}</v-stepper-step>
        <!-- étape 3 : récap et paiement-->
        <v-stepper-step step="3">{{$t('subt_3')}}</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <!-- PRISE EN CHARGE -->
        <v-stepper-content step="1">
          <v-flex
            mb-3
            class="text-xs-center font-weight-medium primary--text subheading"
          >{{$t('subt_1')}}</v-flex>
          <v-flex mt-4 mb-3 xs12 class="text-xs-center font-weight-medium">{{$t('info_1')}}</v-flex>
          <!-- MESSAGES D'ERREURS -->
          <v-layout row>
            <v-flex xs10>
              <!-- DATE PICKER START -->
              <v-menu
                :nudge-left="30"
                ref="menudate"
                :close-on-content-click="false"
                :return-value.sync="date"
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="displayDate"
                  v-bind:label="$t('label_date')"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="date"
                  :min="minDate"
                  @change="$refs.menudate.save(date),resetData(),checkStartDate()"
                  color="primary"
                  no-title
                  scrollable
                  :locale="this.$root.$i18n.locale"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs2></v-flex>
            <!-- TIME PICKER POUR ADRESSE -->
            <v-flex xs10 v-if="type == 'address'">
              <!-- DATE PICKER -->
              <v-menu
                ref="menutime"
                :nudge-left="30"
                :close-on-content-click="false"
                :return-value.sync="time"
                lazy
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="displayTime"
                  v-bind:label="$t('label_heure')"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-model="time"
                  :min="minTime"
                  :format="$t('date_format')"
                  @change="$refs.menutime.save(time),checkStartDate()"
                  color="primary"
                  :locale="this.$root.$i18n.locale"
                ></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>

          <v-layout v-if="type == 'train'" row>
            <v-flex xs6 offset-xs1>
              <!-- NUMERO DE TRAIN si arrivée par train -->
              <v-text-field
                v-model="numTrain"
                v-on:input="traitementTrain"
                v-on:click="resetData"
                pattern="\d*"
                type="number"
                minlength="4"
                :placeholder="$t('train_number')"
              ></v-text-field>
            </v-flex>

            <!-- BULLE D AIDE A LA SAISIE DU NUMERO DE TRAIN -->
            <v-flex offset-xs2>
              <v-menu right offset-y max-width="130">
                <v-btn icon slot="activator">
                  <v-icon x-large color="primary">help</v-icon>
                </v-btn>
                <v-card raised>
                  <v-card-title
                    primary-title
                    class="text-xs-center primary--text"
                  >{{$t('helper_train_titre')}}</v-card-title>
                  <v-flex pa-1 class="grey--text text-xs-center">{{$t('helper_train_content')}}</v-flex>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>

          <!-- SELECTION DE L'ARRET EN GARE POUR TRAIN -->
          <v-flex v-if="gares.length" xs12>
            <!--
            Le texte du select correspond au NOM de la gare + HEURE d'arrivée
            L'objet que l'on traite est un OBJET gare contentant plus d'infos
            Lorsque l'on choisit une gare, on apelle verifGare() qui vérifie :
            - le lieu
            - les horaires
            -->
            <v-select
              :items="gares"
              v-model="selectedGare"
              item-text="select_display"
              item-value="gare"
              v-bind:label="$t('select_gare')"
              single-line
              v-on:input="verifGare"
            ></v-select>
          </v-flex>

          <!-- NUMERO DE VOL POUR VOL -->
          <v-layout v-if="type == 'flight'" row>
            <v-flex xs6 offset-xs1>
              <v-text-field
                v-model="numVol"
                mask="NN ####"
                v-on:input="traitementVol"
                v-on:click="resetData"
                type="text"
                :placeholder="$t('flight_number')"
              ></v-text-field>
            </v-flex>

            <v-flex xs1 offset-xs2>
              <!-- BULLE D AIDE A LA SAISIE DU NUMERO DE VOL -->
              <v-menu right offset-y max-width="130">
                <v-btn icon slot="activator">
                  <v-icon x-large color="primary">help</v-icon>
                </v-btn>
                <v-card raised>
                  <v-card-title
                    primary-title
                    class="text-xs-center primary--text"
                  >{{$t('helper_flight_titre')}}</v-card-title>
                  <v-flex pa-1 class="grey--text text-xs-center">{{$t('helper_flight_content')}}</v-flex>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>

          <v-flex xs12 v-if="airport_chosen != ''">
            <v-text-field v-model="airport_chosen" readonly type="text"></v-text-field>
          </v-flex>

          <!-- ADRESSE DE PRISE EN CHARGE POUR ADRESSE -->
          <v-flex xs12 v-if="type == 'address'">
            <v-text-field
              v-model="startPlaceTextfield"
              ref="autocomplete_start"
              :placeholder="$t('label_address_depart')"
            ></v-text-field>
          </v-flex>

          <!-- INFORMATIONS DE LIVRAISON ET TYPE DE PRESTATION -->
          <v-flex mt-5 mb-3 xs12 class="text-xs-center font-weight-medium">{{$t('info_2')}}</v-flex>

          <!-- ADRESSE DE LIVRAISON POUR TOUS LES CAS -->
          <v-flex xs12>
            <v-text-field
              v-model="endPlaceTextfield"
              ref="autocomplete_end"
              :placeholder="$t('label_address_livraison')"
            ></v-text-field>
          </v-flex>

          <!-- SWITCH correspondant au type de prestation : livraison ou consigne
    par défaut consigne
          -->
          <v-flex mt-3 mb-2 xs12>
            <v-switch
              v-bind:label="$t('livraison_asap')"
              v-model="livraisonDirecte"
              color="primary"
            ></v-switch>
          </v-flex>

          <v-layout v-if="!livraisonDirecte" row>
            <v-flex xs10>
              <!-- DATE PICKER SI CONSIGNE -->
              <v-menu
                :nudge-left="30"
                ref="menudateend"
                :close-on-content-click="false"
                :return-value.sync="dateEnd"
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="displayDateEnd"
                  v-bind:label="$t('label_date')"
                  prepend-icon="event"
                  readonly
                ></v-text-field>

                <v-date-picker
                  v-model="dateEnd"
                  :min="minDateEnd"
                  @input="$refs.menudateend.save(dateEnd),checkEndDate()"
                  color="primary"
                  scrollable
                  no-title
                  :locale="this.$root.$i18n.locale"
                ></v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs2></v-flex>
            <!-- TIME PICKER SI CONSIGNE -->
            <v-flex xs10>
              <!-- DATE PICKER -->
              <v-menu
                :nudge-left="30"
                ref="menutimeend"
                :close-on-content-click="false"
                :return-value.sync="timeEnd"
                lazy
                full-width
                min-width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="displayTimeEnd"
                  v-bind:label="$t('label_heure')"
                  prepend-icon="access_time"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-model="timeEnd"
                  :format="$t('date_format')"
                  @change="$refs.menutimeend.save(timeEnd),checkEndDate()"
                  color="primary"
                  :locale="this.$root.$i18n.locale"
                ></v-time-picker>
              </v-menu>
            </v-flex>
          </v-layout>

          <!-- Bouton pour continuer la saisie des Informations
Désactivé si le form n'est pas valide
          -->
          <v-flex xs12 class="text-xs-right">
            <v-btn icon large :disabled="!isFormOk()" color="primary" @click.native="step=2" dark>
              <v-icon x-large>navigate_next</v-icon>
            </v-btn>
          </v-flex>
        </v-stepper-content>

        <!-- Deuxième étape : saisie des bagages -->
        <v-stepper-content step="2">
          <v-flex
            mb-3
            class="text-xs-center font-weight-medium primary--text subheading"
          >{{$t('subt_2')}}</v-flex>
          <!-- Gestion des bagages -->
          <v-layout row>
            <v-flex xs4>
              <v-btn round color="primary" @click.native="ajoutBagage('cabine')" dark>
                <v-icon left>add</v-icon>
                {{$t('bagage_cabine')}}
              </v-btn>
            </v-flex>
            <!-- BULLE D INFO POUR LES BAGAGES  -->
            <v-flex xs2 offset-xs4>
              <v-menu right offset-y max-width="150">
                <v-btn icon slot="activator">
                  <v-icon x-large color="grey">help</v-icon>
                </v-btn>
                <v-card raised>
                  <v-flex pa-2 class="primary--text text-xs-center">{{$t('helper_cabine_titre')}}</v-flex>
                  <v-flex pa-1 class="grey--text text-xs-center">{{$t('helper_cabine_content')}}</v-flex>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>

          <v-layout row v-for="bag in bagagesCabine" :key="bag.id">
            <v-flex xs2 class="text-xs-center">
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesCabine, bag)">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs5>
              <v-text-field allow-overflow v-bind:label="$t('bagage_nom')" v-model="bag.name"></v-text-field>
            </v-flex>
            <v-divider vertical></v-divider>
            <v-flex xs5>
              <v-text-field class="bagage-descr" v-bind:label="$t('bagage_descr')" v-model="bag.details"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-btn round color="primary" @click.native="ajoutBagage('soute')" dark>
                <v-icon left>add</v-icon>
                {{$t('bagage_soute')}}
              </v-btn>
            </v-flex>

            <v-flex xs2 offset-xs4>
              <!-- BULLE D INFO POUR LES BAGAGES  -->
              <v-menu right offset-y max-width="150">
                <v-btn icon slot="activator">
                  <v-icon x-large color="grey">help</v-icon>
                </v-btn>
                <v-card raised>
                  <v-flex pa-2 class="primary--text text-xs-center">{{$t('helper_soute_titre')}}</v-flex>
                  <v-flex pa-1 class="grey--text text-xs-center">{{$t('helper_soute_content')}}</v-flex>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row v-for="bag in bagagesSoute" :key="bag.id">
            <v-flex xs2>
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesSoute, bag)">
                <v-icon>clear</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs5>
              <v-text-field v-bind:label="$t('bagage_nom')" v-model="bag.name"></v-text-field>
            </v-flex>
            <v-divider vertical></v-divider>
            <v-flex xs5>
              <v-text-field v-bind:label="$t('bagage_descr')" v-model="bag.details"></v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4>
              <v-btn round color="primary" @click.native="ajoutBagage('autre')" dark>
                <v-icon left>add</v-icon>
                {{$t('bagage_autre')}}
              </v-btn>
            </v-flex>
            <v-flex xs2 offset-xs4>
              <!-- BULLE D INFO POUR LES BAGAGES  -->
              <v-menu right offset-y max-width="150">
                <v-btn icon slot="activator">
                  <v-icon x-large color="grey">help</v-icon>
                </v-btn>
                <v-card raised>
                  <v-flex pa-2 class="primary--text text-xs-center">{{$t('helper_autre_titre')}}</v-flex>
                  <v-flex pa-1 class="grey--text text-xs-center">{{$t('helper_autre_content')}}</v-flex>
                </v-card>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-layout row v-for="bag in bagagesAutre" :key="bag.id">
            <v-flex xs2>
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesAutre, bag)">
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

          <v-flex xs12>
            <v-subheader
              v-if="compteurBagages > 1"
            >{{$t('total')}} : {{compteurBagages}} {{$t('luggages')}}</v-subheader>
            <v-subheader
              v-if="compteurBagages == 1"
            >{{$t('total')}} : {{compteurBagages}} {{$t('luggage')}}</v-subheader>
            <v-subheader v-if="compteurBagages ==0">{{$t('bagages_empty')}}</v-subheader>
          </v-flex>
          <v-layout row>
            <v-flex class="text-xs-left">
              <v-btn icon large color="orange lighten-1" @click.native="step=1" dark>
                <v-icon x-large>navigate_before</v-icon>
              </v-btn>
            </v-flex>
            <v-flex class="text-xs-right">
              <v-btn
                icon
                large
                :disabled="!verifBagage()"
                color="primary"
                @click.native="step=3,getDeliveryPrice()"
                dark
              >
                <v-icon x-large>navigate_next</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-stepper-content>

        <v-stepper-content step="3">
          <!-- Récapitulatif -->
          <v-flex
            mb-3
            class="text-xs-center font-weight-medium primary--text subheading"
          >{{$t('subt_3')}}</v-flex>
          <v-card v-if="reponse != null">
            <v-flex
              pt-2
              pb-2
              mt-2
              mb-2
              class="text-xs-center subheading font-weight-bold green lighten-3"
            >{{$t('takeover_label')}}</v-flex>
            <v-flex
              xs12
              class="text-xs-center"
              v-if="type=='address'"
            >{{reponse.start_position.address}}</v-flex>
            <v-flex xs12 class="text-xs-center" v-else>{{reponse.start_position.name}}</v-flex>
            <v-flex
              pt-1
              xs12
              class="text-xs-center"
            >Le {{moment(reponse.delivery.start_date).format('LL')}} {{$t('at')}} {{moment(reponse.delivery.start_date).format('LT')}}</v-flex>

            <v-flex
              pt-2
              pb-2
              mt-2
              mb-2
              class="text-xs-center subheading font-weight-bold green lighten-3"
            >{{$t('livraison_label')}}</v-flex>
            <v-flex xs12 class="text-xs-center">{{reponse.end_position.address}}</v-flex>
            <v-flex pt-1 xs12
              class="text-xs-center"
              v-if="reponse.delivery.time_consigne !== null"
            >Le {{moment(reponse.delivery.end_date).format('LL')}} {{$t('at')}} {{moment(reponse.delivery.end_date).format('LT')}}</v-flex>
            <v-flex pt-1 xs12 class="text-xs-center" v-else>{{$t('livraison_asap')}}</v-flex>

            <v-flex
              pt-2
              pb-2
              mt-2
              mb-2
              class="text-xs-center subheading font-weight-bold green lighten-3"
            >{{$t('bagages')}}</v-flex>

            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesCabine>0 && compteurBagagesCabine<=1"
            >{{compteurBagagesCabine}} {{$t('bagage_cabine')}}</v-flex>
            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesCabine>1"
            >{{compteurBagagesCabine}} {{$t('bagages_cabine')}}</v-flex>

            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesSoute>0 && compteurBagagesSoute<=1"
            >{{compteurBagagesSoute}} {{$t('bagage_soute')}}</v-flex>
            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesSoute>1"
            >{{compteurBagagesSoute}} {{$t('bagages_soute')}}</v-flex>

            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesAutre>0 && compteurBagagesAutre<=1"
            >{{compteurBagagesAutre}} {{$t('bagage_autre')}}</v-flex>
            <v-flex
              xs12
              class="text-xs-center"
              v-if="compteurBagagesAutre>1"
            >{{compteurBagagesAutre}} {{$t('bagages_autre')}}</v-flex>
          </v-card>

          <v-btn icon large color="orange lighten-1" @click.native="step=2,deliveryPrice = null" dark>
            <v-icon x-large>navigate_before</v-icon>
          </v-btn>
          <v-btn color="primary" @click.native="createDelivery()" dark>{{$t('payer') + ' ' + (deliveryPrice === null ? '' : (deliveryPrice + ' €'))}}</v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

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

    <db-menu></db-menu>
  </div>
</template>

<script>
import BackHeader from "../BackHeader.vue";
import Menu from "./Menu.vue";
import axios from "axios";
import Api from "../../api";

export default {
  components: {
    "back-header": BackHeader,
    "db-menu": Menu
  },
  props: ["type"],

  data() {
    return {
      // Prix de la course
      deliveryPrice: null,

      // Déclencheur de la modal d'erreur
      hasError: false,

      // Message d'erreur
      error: "",
      status: {
        startPlaceOk: false,
        endPlaceOK: false,
        startDateOk: true,
        endDateOk: true
      },

      // définit l'étape actuelle du formulaire
      step: 0,

      // correspond à l'id de la delivery
      // id utilisé pour payer après la création d'une demande
      activeDeliveryId: "",

      // définit le type de prestation souhaitée, true=livraison, false=consigne
      livraisonDirecte: false,

      // date minimum pour le picker, correspond à la date actuelle fromatée pour le picker
      minDate: this.moment()
        .format()
        .substring(0, 10),

      // correspond à la date de prise en charge
      date: this.moment()
        .format()
        .substring(0, 10),

      // correspond à l'heure de prise en charge
      time: this.moment().add(4, 'hours').format("LT"),

      // correspond à la date de livraison
      dateEnd: this.moment()
        .format()
        .substring(0, 10),

      // correspond à l'heure de livraison
      timeEnd: this.moment()
        .add(6, "hours")
        .format("LT"),

      // lieu de prise en charge (Objet / string)
      startPlace: null,
      startPlaceTextfield: "",

      // lieu de livraison (Objet / string)
      endPlace: null,
      endPlaceTextfield: "",

      // les départements authorisés qui seront pris en compte
      authorized: [],

      // api key sncf
      sncf_key: "7308cd76-a20f-4f01-9cc3-59d4742bba24",

      // numéro de train saisi
      numTrain: "",

      // liste des gares correspondant à ce train
      gares: [],

      // arrêt choisi par le client
      selectedGare: null,

      // app id flightstats
      flight_app_id: "95a4eb71",

      // app key flightstats
      flight_app_key: "84cb52736b8c4db53b753b8f87be34a8",

      // numéro de vol saisi
      numVol: "",

      airport_chosen: "",

      // array des bagages cabine
      bagagesCabine: [],

      // array des bagages soute
      bagagesSoute: [],

      // array des bagages autre
      bagagesAutre: []
    };
  },

  // les proprités computed sont des données qui sont réactives au changement
  // on les utilise de la même manière que les données classiques

  computed: {
    // Id de la compagnie aérienne
    compagnyId() {
      return this.numVol.substring(0, 2);
    },
    // Id du vol
    flightId() {
      return this.numVol.substring(2, 6);
    },

    //compteur du nombre de bagages indiqués par le client
    compteurBagages() {
      return (
        this.bagagesCabine.length +
        this.bagagesSoute.length +
        this.bagagesAutre.length
      );
    },

    compteurBagagesCabine() {
      return this.bagagesCabine.length;
    },

    compteurBagagesSoute() {
      return this.bagagesSoute.length;
    },

    compteurBagagesAutre() {
      return this.bagagesAutre.length;
    },

    // Date minimale pour la prise en charge
    // si la date est aujourd'hui, restriction (pas avant l'heure courante)
    minTime() {
      let time;
      // si c'est aujourd'hui alors on modifie l'heure et le minimum
      if (this.moment(this.dateTime).isSame(this.moment(), "day")) {
        let now = this.moment().add(4, 'hours').format("LT");
        // si jamais l'heure sélectionnée est antérieure à l'heure actuelle alors on la remet à l'heure courante
        if (this.time < this.moment().format("LT")) {
          this.time = now;
        }
        // dans tous les cas, on met le minimum à l'heure actuelle
        time = now;
      }
      // sinon, aucune restriction
      else {
        time = "";
      }
      return time;
    },

    // Date minimale pour la consigne en fonction à la date de prise en charge indiquée
    minDateEnd() {
      console.log(this.date);
      let end = this.moment(this.date)
        .format()
        .substring(0, 10);
      console.log(end);
      this.dateEnd = end.substring(0, 10);
      return end;
    },

    // assemblage et formatage de la date et de l'heure de départ
    dateTime() {
      let date = this.moment(this.date);
      let time = this.moment(this.time, "hhmm");
      date.set("hours", time.hours());
      date.set("minutes", time.minutes());
      this.date = date.format().substring(0, 10);
      return date;
    },

    // assemblage et formatage de la date et de l'heure de livraison
    dateTimeEnd() {
      let date = this.moment(this.dateEnd);
      let time = this.moment(this.timeEnd, "hhmm");
      date.set("hours", time.hours());
      date.set("minutes", time.minutes());
      this.dateEnd = date.format().substring(0, 10);
      return date;
    },

    // assemblage et formatage de la date et de l'heure de prise en charge
    // utilisée pour l'envoi des données au serveur
    dateStartToJson() {
      let date = new Date(this.date);
      if (typeof this.time === "string") {
        date.setHours(this.time.match(/^(\d+)/)[1]);
        date.setMinutes(this.time.match(/:(\d+)/)[1]);
      } else {
        date.setHours(this.time.getHours());
        date.setMinutes(this.time.getMinutes());
      }
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      )
        .toJSON()
        .split(".")[0]
        .replace("T", " ");
    },

    // assemblage et formatage de la date et de l'heure de livraison
    // utilisée pour l'envoi des données au serveur
    dateEndToJson() {
      console.log(this.timeEnd);
      let date = new Date(this.dateEnd);
      if (typeof this.timeEnd === "string") {
        date.setHours(this.timeEnd.match(/^(\d+)/)[1]);
        date.setMinutes(this.timeEnd.match(/:(\d+)/)[1]);
      } else {
        date.setHours(this.timeEnd.getHours());
        date.setMinutes(this.timeEnd.getMinutes());
      }
      return new Date(
        Date.UTC(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        )
      )
        .toJSON()
        .split(".")[0]
        .replace("T", " ");
    },

    // Affichage du label du datepicker PRISE EN CHARGE de manière plus humaine pour le client
    displayDate() {
      //return this.dateTime.toLocaleString().substring(0,10);
      return this.moment(this.dateTime).format("L");
    },

    // Affichage du label du timepicker PRISE EN CHARGE de manière plus "humaine" pour l'utilisateur
    displayTime() {
      return this.moment(this.dateTime).format("LT");
    },

    // Affichage du label du datepicker LIVRAISON de manière plus "humaine" pour l'utilisateur
    displayDateEnd() {
      return this.moment(this.dateTimeEnd).format("L");
    },

    // Affichage du label du timepicker LIVRAISON de manière plus "humaine" pour l'utilisateur
    displayTimeEnd() {
      return this.moment(this.dateTimeEnd).format("LT");
    },

    // Méthode qui permet de vérifier les dates indiquées par le client
    // on calcule la différence entre les date de prise en charge et de la livraison
    // si cette durée est inférieure à 2 heures, alors on met un message d'erreur
    verifDate() {
      this.errors["date_livraison"] = "";
      let start = this.moment(this.dateTime);
      let end = this.moment(this.dateTimeEnd);
      let duration = end.diff(start, "minutes");
      // si la durée est inférieure à 2 heures
      if (duration < 120) {
        this.errors["date_livraison"] = this.$i18n.t("error_consigne_trop_tot");
      }
      // si la durée est supérieure à 24 heures
      else if (duration > 1440) {
        this.errors["date_livraison"] = this.$i18n.t(
          "error_consigne_trop_tard"
        );
      } else {
        this.errors["date_livraison"] = "";
      }

      // si le client souhaite une livraison directe, on passe la verification de la date
      if (this.livraisonDirecte) {
        this.errors["date_livraison"] = "";
      }
      // on force la mise à jour pour mettre à jour le message d'erreur selon le changement de date
      this.$forceUpdate();
    },

    reponse() {
      var req;
      if (this.step == 3) {
        req = {
          start_position: {
            name: this.startPlace.name,
            address: this.startPlace.formatted_address,
            lat: this.startPlace.geometry.location.lat(),
            lng: this.startPlace.geometry.location.lng()
          },
          end_position: {
            name: this.endPlace.name,
            address: this.endPlace.formatted_address,
            lat: this.endPlace.geometry.location.lat(),
            lng: this.endPlace.geometry.location.lng()
          },
          delivery: {
            comment: "Commentaire",
            start_date: this.dateStartToJson,
            end_date: this.dateEndToJson,
            no_train: this.numTrain,
            time_consigne: this.computeTimeConsign()
          },
          bagages: {
            "1": this.bagagesCabine,
            "2": this.bagagesSoute,
            "3": this.bagagesAutre
          }
        };
      }
      //this.createDelivery();
      return req;
    }
  },

  methods: {

    async getDeliveryPrice() {
      console.log('Getting delivery price');
      let api = new Api();
      console.log(window.localStorage.getItem('jwt'))
      try {
        let response = await api.getDeliveryPrice(this.reponse);
        this.deliveryPrice = JSON.parse(data).price;
        console.log(response);
      } catch(error) {
        console.log(error);
      }
      
    },

    // La date de début doit être au moins 4 après après now
    checkStartDate() {
      let start = this.moment(this.date + ' ' + this.time)
      let now = this.moment()
      
      let diff_minutes = start.diff(now, 'minutes');
      if (diff_minutes < 240) {
        this.status.startDateOk = false;
        this.error = this.$i18n.t('error_min_4_hour');
        this.hasError = true;
      } else {
        this.status.startDateOk = true;
      }
    },

    checkEndDate() {
      let start = this.moment(this.date + ' ' + this.time);
      let end = this.moment(this.dateEnd + ' ' + this.timeEnd);
      
      let diff_minutes = end.diff(start, 'minutes');
      console.log(diff_minutes)
      if (diff_minutes < 0) {
        this.status.endDateOK = false;
        this.error = this.$i18n.t('error_start_inf_end');
        this.hasError = true;
      }  else if (diff_minutes < 120) {
        this.status.endDateOK = false;
        this.error = this.$i18n.t('error_min_2h_consigne');
        this.hasError = true;
      } else if (diff_minutes > 1440) {
        this.status.endDateOK = false;
        this.error = this.$i18n.t('error_max_24h_consigne');
        this.hasError = true;
      } else {
        this.status.endDateOk = true;
      }
    },

    // Méthode qui permet de récupérer les départements authorisés par l'application
    getDepartments() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");
      axios
        .get("https://dev-deliverbag.supconception.fr/departments/authorized", {
          headers: {
            Authorization: "Bearer " + jwt
          }
        })
        .then(response => {
          let json = JSON.parse(response.data);
          for (let i = 0; i < json.length; i++) {
            self.authorized.push(json[i].number.toString());
            self.authorized.push(json[i].name);
          }
        })
        .catch(error => {
          console.log("An error occured in getDepartments");
          console.log(error);
        });
    },

    // Méthode qui permet de récupérer les bagages du client
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

          self.bagagesCabine = [];
          self.bagagesSoute = [];
          self.bagagesAutre = [];
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
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
        })
        .catch(error => {
          self.error = self.$i18n.t("unable_to_retrieve_data_from_server");
          self.hasError = true;
        });
    },

    computeTimeConsign() {
      let start = this.moment(this.date + ' ' + this.time);
      let end = this.moment(this.dateEnd + ' ' + this.timeEnd);
      
      let diff_minutes = end.diff(start, 'minutes');
      if (this.livraisonDirecte) return null;
      return diff_minutes;
    },

    // C'est la méthode qui est appelé lors de la saisie du numéro de train
    // si le numéro est correct, alors un récupère les différents arrêts du voyage
    traitementTrain() {
      let self = this;
      // Les numéros de trains sont composés d'au moins 4 caractères
      if (this.numTrain.length >= 4) {
        // On formatte la date de voyage pour correspondre au format attendu par l' API SNCF
        let dateTrain = this.date.split("T")[0] + "T000000";
        $.get(
          `https://api.sncf.com/v1/coverage/sncf/vehicle_journeys/?headsign=${
            this.numTrain
          }&since=${dateTrain}&key=${this.sncf_key} `,
          function(data) {
            self.error = "";
            let stops = data.vehicle_journeys[0].stop_times;
            for (let i = 1; i < stops.length; i++) {
              let time = self
                .moment(stops[i].arrival_time.substring(0, 4), "hmm")
                .format("LT");
              self.gares.push({
                gare: stops[i],
                select_display:
                  stops[i].stop_point.name +
                  " " +
                  self.$i18n.t("at") +
                  " " +
                  time
              });
            }
          }
        ).fail(function(error) {
          switch (error.status) {
            case 404:
              self.error = self.$i18n.t("error_404_sncf");
              break;
            case 401:
              self.error = self.$i18n.t("error_401_sncf");
              break;
            case 403:
              self.error = self.$i18n.t("error_403_sncf");
              break;
            case 500:
              self.error = self.$i18n.t("error_500_sncf");
              break;
            default:
              if (self.date.length) {
                self.error = self.$i18n.t("error_default_sncf");
              } else {
                self.error = self.$i18n.t("date_voyage_vide");
              }
          }
          self.hasError = true;
        });
      }
    },

    // Méthode qui est appelée lorsque le client sélectionne une gare
    verifGare() {
      // On récupère les informatons de localisation ainsi que l'heure d'arrivée en gare
      let lat = parseFloat(this.selectedGare.stop_point.coord.lat);
      let lng = parseFloat(this.selectedGare.stop_point.coord.lon);
      let trainTime = this.selectedGare.arrival_time;

      // On formatte correctement l'heure d'arrivée
      this.time = this.moment(trainTime.substring(0, 4), "hmm").format("HH:mm");

      // Si l'heure d'arrivée en gare est antérieure à l'heure actuelle, alors on déclenche une erreur
      if (this.time < this.moment().format("LT")) {
        this.status.startPlaceOk = false;
        this.error = this.$i18n.t("error_heure");
        this.hasError = true;
      } else {
        this.status.startPlaceOk = true;
      }
      //  this.time.setMinutes(parseInt(trainTime.substring(2,4)));

      let pos = { lat: lat, lng: lng };
      let self = this;

      // On géocode à partir de la position (lat,lng)
      // afin d'obtenir une adresse formatée sous forme d'objet PLACE

      let geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          latLng: pos
        },
        function(results, status) {
          if (status !== google.maps.GeocoderStatus.OK) {
            this.status.startPlaceOk = false;
            this.error = "Erreur lors de l'appel à géocode"
            this.hasError = true;
            console.log(status);
          }
          if (status == google.maps.GeocoderStatus.OK) {
            self.startPlace = results[1];
            self.startPlace.name =
              "Gare de " + self.selectedGare.stop_point.name;
            // Si le géocodage se passe correctement, on vérifie alors que le lieu souhaité est inclus dans les départements authorisés
            // le second paramètre sert pour différencier les erreurs
            self.status.startPlaceOk = self.verifyDepartment(
              self.startPlace,
              "gare"
            );
          }
        }
      );
    },

    // Méthode qui permet de vérifier le département d'un objet PLACE
    // Le second paramètre LIEU permet de connaître l'origine de la demande (adresse, gare ou aéroport)
    verifyDepartment(place, lieu) {
      console.log("------ Verify department ------");
      console.log(place);
      console.log(lieu);
      let types = place.types;
      let res = place.address_components;
      let found = false;
      let isInrange = false;
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].types.length; j++) {
          // Certains objets retournés par Google Maps n'ont pas de code "postal_code"
          // On vérifie alors la région, que l'on retrouve dans l'objet "administrative_area_level_2"
          if (
            res[i].types[j] == "postal_code" ||
            res[i].types[j] == "administrative_area_level_2"
          ) {
            found = true;
            let dep = res[i].short_name;
            // On prend les 2 premiers chiffres pour vérifier le département
            if (
              this.authorized.includes(dep.substr(0, 2)) ||
              this.authorized.includes(dep)
            ) {
              isInrange = true;
            }
          }
        }
      }
      // si le lieu est dans la région couverte par Deliverbag,
      // on vérifie ensuite la précision du lieu indiqué
      if (isInrange) {
        return this.verifyPrecision(place, lieu);
      } else {
        // On averti l'utilisateur : le lieu n'est pas encore desservi
        let text = this.$i18n.t("error_start_place");
        if (lieu == "end") {
          text = this.$i18n.t("error_end_place");
        }
        if (lieu == "gare") {
          text = this.$i18n.t("error_gare");
        }
        if (lieu == "airport") {
          text = this.$i18n.t("this_airport");
        }
        this.error = text + this.$i18n.t("error_place");
        this.hasError = true;
        return false;
      }
    },

    // Méthode qui permet de vérifier la précision d'une adresse donnée
    // Le second paramètre LIEU permet de connaître l'origine de la demande
    verifyPrecision(place, lieu) {
      let text = this.$i18n.t("error_start_place");
      if (lieu == "end") {
        text = this.$i18n.t("error_end_place");
      }

      let types = place.types;

      // url pour avoir la liste des types supportés par google maps qui peuvent être présents dans un objet PLACE
      // https://developers.google.com/places/supported_types
      // par exemple, si le client indique "Rue Sainte Catherine" sans numéro, alors on retrouvera le type "route" dans l'objet
      // si le client rentre  9 rue xxxx alors il n'y aura pas le type "route"
      // actuellement c'est uniquement une vérification pour empêcher la saisie d'une adresse sans numéro
      if (types.includes("route")) {
        this.error = text + this.$i18n.t("error_precision");
        this.hasError = true;
      } else {
        return true;
      }
    },

    // Méthode qui remet à zéro les messages d'erreurs et les informations de train et de vol
    // On l'apelle par exemple lorsque le client change la date
    resetData() {
      this.numVol = "";
      this.numTrain = "";
      this.gares = [];
      this.error = "";
      this.deliveryPrice = null;
    },

    // On vérifie que les données saisies par le client sont correctes
    isFormOk() {
      return (
        this.status.startPlaceOk && this.status.endPlaceOK && this.status.startDateOk && this.status.endDateOk
      );
    },

    // Méthode pour ajouter un bagage en fonction du type
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

    // Méthode pour supprimer un bagage
    supprBagage(array, obj) {
      let index = array.indexOf(obj);
      if (index > -1) {
        array.splice(index, 1);
      }
    },

    // On vérifie que la partie concernant les bagages est correcte
    // - il faut qu'il y ait au minimum un bagage (peu importe la catégorie)
    // - on vérifie également que les bagages de type AUTRE soient nommés (facultatifs pour les types cabine et soute)
    // TODO: définir une limite max de bagages que le client peut ajouter
    verifBagage() {
      return (
        (this.bagagesCabine.length ||
          this.bagagesSoute.length ||
          this.bagagesAutre.length) &&
        this.bagageOk(this.bagagesAutre)
      );
    },

    //on vérifie également que les bagages autres soient nommés
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
    },

    createDelivery() {
      let self = this;
      let jwt = window.localStorage.getItem("jwt");

      console.log("Creating delivery");
      console.log(self.reponse);
      console.log(JSON.stringify(self.reponse));

      axios
        .post(
          "https://dev-deliverbag.supconception.fr/mobile/deliveries",
          self.reponse,
          {
            headers: {
              Authorization: "Bearer " + jwt
            }
          }
        )
        .then(response => {
          self.activeDeliveryId = response.data.id;
          self.payer();
        })
        .catch(error => {
          console.log("An error occured in createDelivery");
          console.log(error);
        });
    },

    payer() {
      let self = this;
      let jwt = window.localStorage.getItem('jwt');

      axios.post(
        "https://dev-deliverbag.supconception.fr/mobile/deliveries/payment", {
            delivery_id: self.activeDeliveryId
        }, {
          headers: {
            'Authorization': 'Bearer ' + jwt
          }
        }
      ).then(response => {
          let data = response.data;
          console.log(data);
          self.$router.push('/my-deliveries');
      }).catch(error => {
          console.log("An error occured in payer()");
          console.log(error);
      });
    },

    traitementVol() {
      var self = this;
      let year = this.date.substring(0, 4);
      let month = this.date.substring(5, 7);
      let day = this.date.substring(8, 10);

      if (this.numVol.length >= 5) {
        $.ajax({
          url: `https://api.flightstats.com/flex/flightstatus/rest/v2/jsonp/flight/status/${
            self.compagnyId
          }/${self.flightId}/arr/${year}/${month}/${day}?appId=${
            self.flight_app_id
          }&appKey=${self.flight_app_key}&utc=false`,
          dataType: "jsonp",
          success: function(data) {
            //console.log(data);
            if (data.flightStatuses.length == 0) {
              self.error = self.$i18n.t("airport_error");
            } else {
              let res = data.flightStatuses[0];
              let dateGate = self.moment(
                res.operationalTimes.scheduledGateArrival.dateLocal
              );
              if (res.operationalTimes.estimatedGateArrival) {
                dateGate = self.moment(
                  res.operationalTimes.estimatedGateArrival.dateLocal
                );
              }
              self.date = dateGate;

              self.time = self.moment(self.date).format("LT");
              if (self.time < self.moment().format("LT")) {
                self.errors["error_date"] = self.$i18n.t("error_heure");
              } else {
                self.errors["error_date"] = "";
              }

              let departure_airport = res.departureAirportFsCode;
              let arrival_airport = res.arrivalAirportFsCode;
              let arrivee, city;
              data.appendix.airports.forEach(function(element) {
                if (element.fs == arrival_airport) {
                  console.log(element);
                  arrivee = element.name;
                  city = element.city;
                  let lat = parseFloat(element.latitude);
                  let lng = parseFloat(element.longitude);
                  let pos = { lat: lat, lng: lng };
                  let geocoder = new google.maps.Geocoder();
                  geocoder.geocode(
                    {
                      latLng: pos
                    },
                    function(results, status) {
                      if (status !== google.maps.GeocoderStatus.OK) {
                        alert("Erreur lors de l'appel a geocode");
                        console.log(status);
                        return null;
                      }
                      if (status == google.maps.GeocoderStatus.OK) {
                        self.startPlace = results[1];
                        self.startPlace.name = self.$i18n.t("airport") + city;
                        self.status.startPlaceOk = self.verifyDepartment(
                          self.startPlace,
                          "airport"
                        );
                      }
                    }
                  );
                }
              });

              // c'est le texte que le client verra  :
              // aéroport d'arrivée + heure d'arrivée
              self.airport_chosen =
                arrivee +
                " " +
                self.$t("at") +
                " " +
                self.moment(self.date).format("LT");
            }
          },
          error: function(e) {
            self.error =
              "Une erreur est survenue lors de la recherche de ce vol";
            console.log(e);
          }
        });
      }
    }
  },

  mounted() {
    // On récupère les bagages du client et les départements authorisés
    this.getBagages();
    this.getDepartments();
    let self = this;
    // On crée les bornes de recherches pour orienter les résultats des autocompletes en GIRONDE
    let boundsGironde = new google.maps.LatLngBounds(
      new google.maps.LatLng(44.1939019, -1.2614241),
      new google.maps.LatLng(45.573636, 0.315137)
    );

    let options = {
      bounds: boundsGironde,
      componentRestrictions: { country: "fr" }
    };

    // On initialise l'autocomplete GOOGLE MAPS pour l'adresse de la livraison
    let addressEnd = this.$refs.autocomplete_end.$refs.input;
    let endPlace = new google.maps.places.Autocomplete(addressEnd, options);
    endPlace.addListener("place_changed", function() {
      self.endPlace = this.getPlace();
      self.endPlaceTextfield = this.getPlace()["formatted_address"];
      self.status.endPlaceOK = self.verifyDepartment(self.endPlace, "end");
    });

    if (this.type == "address") {
      // On initialise l'autocomplete GOOGLE MAPS pour l'adresse de prise en charge
      // UNQIUEMENT SI ON EST EN SAISIE D'ADRESSE
      let addressStart = this.$refs.autocomplete_start.$refs.input;
      let startPlace = new google.maps.places.Autocomplete(
        addressStart,
        options
      );
      startPlace.addListener("place_changed", function() {
        self.startPlace = this.getPlace();
        self.startPlaceTextfield = this.getPlace()["formatted_address"];
        self.status.startPlaceOk = self.verifyDepartment(
          self.startPlace,
          "start"
        );
      });
    }
  }
};
</script>

<style scoped>
input {
  width: 100%;
  height: 40px;
  box-sizing: border-box;
}

.bagage-descr {
  padding-left: 0.2em;
}
</style>