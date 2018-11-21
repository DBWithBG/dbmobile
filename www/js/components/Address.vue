<template>
  <div id="address">
    <demand-header> </demand-header>

    <v-container>
      <v-layout row>
        <v-flex xs12>
        <v-form>
          <v-flex v-if="error.length" mt-3 mb-3 xs12><v-alert dismissible type="warning" value="true">{{error}}</v-alert></v-flex>
          <v-flex mt-2 xs12 text-xs-center><v-text-field v-model="address" label="Adresse de la prise en charge" ref="autocomplete"></v-text-field></v-flex>
          <v-flex mt-2 xs12 text-xs-center><v-date-picker text-xs-center locale="fr-FR" v-model="date"></v-date-picker></v-flex>
          <v-flex mt-4 text-xs-right><v-btn flat color="success" @click="verifyDepartment()">Suivant</v-btn></v-flex>
        </v-form>
  

        </v-flex>
      </v-layout>
    </v-container>
    
  </div>
</template>

<script>
import DemandHeader from "./DemandHeader.vue";
import { Datetime } from "vue-datetime";
import Alert from "./Alert.vue";
import Menu from "./Menu.vue";

export default {
  components: {
    alert: Alert,
    "demand-header": DemandHeader
  },

  data() {
    return {
      date: "",
      address: "",
      error: "",
      place: null
    };
  },

  methods: {
    minDate() {
      this.$moment.suppressDeprecationWarnings = true;
      return new Date().toISOString() | moment("YYYY-MM-DD");
    },

    maxDate() {},

    /*
    ** Verify that the input place is in the service étrange
    ** Actually fixed on '33' , Gironde
    ** @param place : place objet that contains adresse & geolocation informations
    */
    verifyDepartment() {
      console.log("Calling verifyDepartmtent")
      console.log(this.place)
      //var bdx_metropole = {33130, 33370 ,33110,33170,33700,33185,33530,33127,33400,33810,33290,33150,33520,33160,33310,33440,33270,33140,33560,33600,33320,33800,33100,33000,33200,33300};
      var res = this.place['address_components'];
      var found = false;
      var isGironde = false;
      var gironde = "33";
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].types.length; j++) {
          if (res[i].types[j] == "postal_code") {
            found = true;
            
            // We use FOUND to know if there is a postal code for the place
            // For exemple, there is no postal code for Paris
            var dep = res[i].long_name;
            console.log("Found postal code in address : " + dep)
            if (dep.substr(0, 2) == gironde) {
              isGironde = true;
              //  two first .numbers are taken to verify the department
            }
          }
        }
      }
      if (isGironde) {
        // on redirige l'utilisateur sur la page suivante
        console.log("Let's go on /demand-next")
        this.$router.push({
          name: "demand-next",
          params: { date: this.date, place: res }
        });
      } else {
        //console.log(this.$router);
        //this.$router.replace(this.$router.history.current.path);
        // on met une alerte pour lui dire que la gare sélectionnée n'est pas encore desservie
        this.error = "Ce lieu n'est pas encore desservi par nos services";
        //console.log(this.errors);
      }
    }
  },

  mounted() {    
    var self = this;
    var addressInput = this.$refs.autocomplete.$refs.input;
    addressInput.placeholder = "";
    var options = {
      componentRestrictions: { country: "fr" }
    };
    
    var autocomplete = new google.maps.places.Autocomplete(addressInput, options);

    autocomplete.addListener("place_changed", function() {
      self.address = autocomplete.getPlace().formatted_address
      self.place = autocomplete.getPlace()
    });
  }
};
</script>

<style>
</style>
