<template>
  <div id="home">
    <demand-header> </demand-header>
    Address component

    <v-layout>
      <alert v-if="error.length" :message="error"> </alert>

      <datetime v-model="date" placeholder="Entrez la date" type="datetime" moment-locale="fr" max-date="2018-07-01">
      </datetime>

    <input class="autocomplete" ref="autocomplete" :placeholder="placeholder" />


  </v-layout>
</div>
</template>

<script>



import DemandHeader from './DemandHeader.vue';
import {Datetime} from 'vue-datetime';
import Alert from './Alert.vue'
import Menu from './Menu.vue'

export default {

  components: {
    'datetime': Datetime,
    'alert' : Alert,
    'db-menu' : Menu,
    'demand-header' : DemandHeader
  },


  data(){
    return {

      date:'',
      place:'',
      error:'',
      placeholder:'Indiquez l\'adresse de prise en charge'
    }
  },

  methods : {

    minDate(){
      this.$moment.suppressDeprecationWarnings = true;
      return (new Date().toISOString() | moment("YYYY-MM-DD"));


    },

    maxDate(){

    },

    /*
    ** Verify that the input place is in the service étrange
    ** Actually fixed on '33' , Gironde
    ** @param place : place objet that contains adresse & geolocation informations
    */
    verifyDepartment(place){

      //var bdx_metropole = {33130, 33370 ,33110,33170,33700,33185,33530,33127,33400,33810,33290,33150,33520,33160,33310,33440,33270,33140,33560,33600,33320,33800,33100,33000,33200,33300};
      var res = place.address_components;
      var found = false;
      var isGironde = false;
      var gironde = '33'
      for (var i = 0; i < res.length; i++) {
        for (var j = 0; j < res[i].types.length; j++) {
          if (res[i].types[j] == "postal_code") {
            found = true;
            // We use FOUND to know if there is a postal code for the place
            // For exemple, there is no postal code for Paris
            var dep = res[i].long_name;
            if (dep.substr(0,2) == gironde){
              isGironde=true;
              //  two first .numbers are taken to verify the department
            }
          }
        }
      }
      if (isGironde){
        // on redirige l'utilisateur sur la page suivante
        this.$router.push( { name:'demand-next', params : {date : this.date, place : place} });
      }
      else{
        //console.log(this.$router);
        //this.$router.replace(this.$router.history.current.path);
        // on met une alerte pour lui dire que la gare sélectionnée n'est pas encore desservie
        this.error="Ce lieu n'est pas encore desservi par nos services";
        //console.log(this.errors);
      }
    }
  },

  mounted(){


    var self=this;
    // VueJs "transforme" les HTMLInput elemnt en 'div'
    // On doit donc récupérer cet objet en passant par l'objet $refs et en definissant une propriété ref='***' dans notre input field
    var address = this.$refs.autocomplete;
    var options = {
      componentRestrictions : {country : 'fr' }
      // Si on veut mettre des restrictions c'est ici !
    };
    console.log(address);
    var startPlace = new google.maps.places.Autocomplete(address, options);



    startPlace.addListener('place_changed', function() {
      self.place=this.getPlace();
      self.verifyDepartment(self.place);

      //end_pos = this.getPlace().geometry.location;
      //  verifyDepartment(this.getPlace());
    });
  }
}
</script>

<style>

#autocomplete{
  height:1em;
  width:1em;

}


</style>
