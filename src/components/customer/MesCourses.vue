<template>

  <div>
    <div v-touch="{
      left:swipeLeft
      }">
      <v-tabs fixed-tabs>
        <v-tab v-for="tab in tabs" :key="tab.id" >
          {{ tab }}
        </v-tab>
        <v-tabs-items :v-model="tabs">


          <v-tab-item
          v-for="tab in demandes" :key="tab.id" >
          <v-data-table
          :headers="headers"
          :items="tab"
          hide-actions
          class="elevation-1"
          hide-headers
          >

          <template slot="items" slot-scope="props">
            <v-expansion-panel>
              <v-expansion-panel-content>
                <div slot="header">Détails de la course {{props.item.id}}</div>
                <div v-if="props.item.status === 5 && !ratingSent">
                  <v-layout row>

                      <star-rating v-model="props.item.rating" :show-rating="false" @click.native.stop="dialog = true" @click.native="sendRating(props.item.id,props.item.rating)"> </star-rating>
                      </v-flex>
                      <v-dialog v-model="dialog" max-width="290">
                      <v-card>
                        <v-card-title class="headline">Notation de la course</v-card-title>
                        <v-layout row>
                        <v-flex xs10 offset-xs1>
                          <v-text-field
                          label="Commentaire"
                          v-model="props.item.details"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                        <v-btn  flat color="green darken-2" @click.native="sendRating(props.item.id,props.item.rating,props.item.details),dialog = false">
                          <span>Envoyer mon avis</span>
                        </v-btn>
                      </v-card>
                    </v-dialog>
                  </v-layout>
              </div>
              <td >Distance : {{ props.item.distance }} km</td>
              <td >Prix : {{ props.item.price }} €</td>
              <td >Temps estimé : {{ props.item.estimated_time }} minutes</td>
            </br>
            <td> Prise en charge : {{ props.item.start_position.name }} </td>
          </br>
          <td >Livraison : {{ props.item.end_position.name }}</td>

          <v-btn flat color='green' @click.native="detailsCourse(props.item.id)">
            <span>Suivi de la course</span>
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>

  </v-data-table>



</v-tab-item>



</v-tabs-items>

</v-tabs>

</div>
<db-menu> </db-menu>
</div>

</template>


<script>


export default {


  data () {
    return {
      ratingSent:false,
      headers: [
        { text: 'Distance', value: 'distance' },
        { text: 'Prix', value: 'price' },
        { text: 'Temps estimé', value: 'estimated_time' },
      ],

      deviceid:'',
      dialog:false,
      tabs: [
        'En cours', 'En attente', 'Passées'],
        demandes: [
          [],
          [],
          []
        ]
      }
    },


    mounted(){

      var self=this;
      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/customers?mobile_token='+localStorage.getItem('deviceId'),
        type : 'GET',
        datatype:'jsonp',
        //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
        success: function(data){
          console.log(data);

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

        },
        error:function(e){
          alert(e);
          console.log(e);
        }
      });

    },

    methods:{

      sendRating(id,rating,com){

        console.log(com);

        if (com != undefined){
          this.ratingSent=true;
        }

        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/ratings',
          type : 'POST',
          data : {
            "delivery_id" : id,
            "mobile_token" : localStorage.getItem('deviceId'),
            "details" : com,
            "rating" : rating,
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            console.log(data);
          },
          error:function(e){
            alert(e);
            console.log(e);
          }
        });
      },
      swipeLeft(){
        this.$router.replace({path: 'demand'});
      },
      detailsCourse(id){
        var ref = window.open('http://dev-deliverbag.supconception.fr/mobile/deliveries/'+id+'?mobile_token='+localStorage.getItem('deviceId'), '_blank', 'location=no,zoom=no',);

      }
    }
  }


  </script>

  <style>

  tbody li {
    width:100vw;
  }
  </style>
