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
                <div v-if="props.item.take_over_delivery != null">
                  <v-layout row>
                    <v-flex xs12>
                      <star-rating v-model="props.item.rating" :show-rating="false"> </star-rating>
                    </v-flex>
                  </v-layout>
                  <v-flex xs5>
                    <v-text-field
                    label="Commentaire"
                    v-model="props.item.details"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5>
                    <v-btn  flat color="green darken-2" @click.native="sendRating(props.item.id,props.item.rating,props.item.details)">
                      <span>Envoyer mon avis</span>
                    </v-btn>
                  </v-flex>
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
        url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/customers',
        type : 'POST',
        data : {"mobile_token" : localStorage.getItem('deviceId')},
        //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
        success: function(data){
          console.log(data[0]);
          for (let i=0;i<data[0].length;i++){
            switch (data[0][i].status) {
              case 0 : self.demandes[1].push(data[0][i]);
              break;
              case 1 : self.demandes[1].push(data[0][i]);
              break;
              case 2 : self.demandes[0].push(data[0][i]);
              break;
              case 3 : self.demandes[0].push(data[0][i]);
              break;
              case 4 : self.demandes[2].push(data[0][i]);
              break;
              case 5 : self.demandes[2].push(data[0][i]);
              break;
            }
          }
        },
        error:function(e){
          alert(e);
          console.log(e);
        }
      });

    },

    methods:{

      sendRating(id,rating,com){

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
