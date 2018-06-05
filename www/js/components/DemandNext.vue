<template>
  <div id="home">
    <p>  Effectuer une demande de prise en charge - Type de demande + infos livraisons </p>
    <alert v-if="error.length" :message="error"> </alert>
    <input class="autocomplete" ref="autocomplete" :placeholder="placeholder" />
    <button v-on:click="sendData()" class="btn btn-medium border border-green uppercase xround-2 " > Envoyer une requête </button>
    <p> Livraison dès que possible OU Livraison planifiée </p>
  </div>

</template>


<script>

import Alert from './Alert.vue'

export default{

  components : {
    'alert' : Alert
  },

  data(){
    return {
      // les paramètres récupérés de la page précdente
      params : this.$route.params,
      // indication de l'input field pour l'adresse de livraison
      placeholder:'Entrez le lieu de restitution',
      // l'objet place qui correspond à un lieu GoogleMaps
      place : '',
      error:''
    }
  },
  methods:{
    getParam(){
      console.log(JSON.stringify(this.$route.params.place));
    },

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
    },


    sendData(){
      var response =
        {
          "start_position":
            {
              "name": this.params.place.address_components.long_name,
              "address":this.params.place.formatted_address,
              'lat' :this.params.place.geometry.location.lat,
              'lng':this.params.place.geometry.location.lng
            }
          ,
          "end_position":
            {
              "name": this.place.address_components.long_name,
              "address":this.place.formatted_address,
              'lat' :this.place.geometry.location.lat,
              'lng':this.place.geometry.location.lng
            }
          ,
          "delivery" :
            {
              "comment" : "Un commentaire... sur une demande de prise en charge...",
              "start_date" : this.params.date,
              "customer_id":2
            }

        }


        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/'+'test/delivery',
          type : 'POST',
          data : {"response" : response},
          success: function(data){
            succes(JSON.parse(data));
          },
          error:function(e){
            console.log(e);
          },
        });
    }
  },
  mounted(){
    // on récupère le contexte
    var self=this;
    // VueJs "transforme" les HTMLInput elemnt en 'div'
    // On doit donc récupérer cet objet en passant par l'objet $refs et en definissant une propriété ref='***' dans notre input field
    var end = this.$refs.autocomplete;
    var options = {
      componentRestrictions : {country : 'fr' }
      // Si on veut mettre des restrictions c'est ici !
    };
    var endPlace = new google.maps.places.Autocomplete(end, options);

    endPlace.addListener('place_changed', function() {
      self.place=this.getPlace();
      self.verifyDepartment(self.place);
      //end_pos = this.getPlace().geometry.location;
      //  verifyDepartment(this.getPlace());
    });

    this.getParam();

  }
}


</script>


<style>

p {
  font-size:2em;
  text-align:center;
}

a {
  text-decoration:none;
}




</style>
