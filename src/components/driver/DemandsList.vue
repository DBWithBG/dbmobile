<template>
  <pull-to
  :top-config="config"
  :top-load-method="refresh"
  >
  <div>
    <back-header message="Liste des demandes"> </back-header>


    <!-- vue 2.5 use slot-scope -->
    <template slot="top-block" slot-scope="props">
    </template>



    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="green"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>



    <v-data-table v-if="!loading"
    :headers="headers"
    :items="deliveries"
    hide-actions
    item-key="id"
    >


    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td> Dans {{ props.item.datetime }} heures </td>
        <td class="text-xs-right"> à {{props.item.distance_from_driver}} </td>
        <td class="text-xs-right">{{ props.item.estimated_time }} minutes</td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-card-text> Prise en charge : {{props.item.start_position.address}}</v-card-text>
        <v-card-text> Livraison : {{props.item.end_position.address}}</v-card-text>
        <v-btn flat color='green' @click.native="prendreEnCharge(active_demand.id)">
          <span>M'engager sur cette demande</span>
        </v-btn>
      </v-card>
    </template>
  </v-data-table>


</div>
</pull-to>
</template>


<script>



export default {


  props:['data'],


  data () {
    return {
      config:{
        pullText: 'Actualiser les demandes',
        triggerText: 'Actualiser les demandes',
        loadingText: 'Mise à jour des demandes...',
        doneText: 'Demandes chargées ! ',
        failText: 'Impossible de mettre à jour',
        loadedStayTime: 400,
        stayDistance: 50,
        triggerDistance: 10
      },
      loading:true,
      deliveries: Object.assign([],this.data),
      user_pos:null,
      headers: [
        {
          text: 'Temps',
          align: 'left',
          value: 'datetime'
        },
        { text: 'Pris en charge', value: 'distance_from_driver'},
        { text: 'Temps estimé', value: 'estimated_time' }
      ],
    }
  },



  methods:{



      prendreEnCharge(id){

        var req = {
          "mobile_token" : '23456',
          "delivery_id" : id
        }

        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/takeovers/start',
          type : 'POST',
          data : req,
          success: function(data){
          },
          error:function(e){
            console.log(e);
          },
        });
      },

      refresh(loaded){
        setTimeout( ()=>{
          console.log('refresh');
          loaded('done')
        },2000);
      },

      getDistanceFromDriver(){

        var self=this;
        var origin = new google.maps.LatLng(parseFloat(self.user_pos.lat),parseFloat(self.user_pos.lng));
        var service = new google.maps.DistanceMatrixService();


        //  self.data[i]['distance_from_driver']=self.getDistance();
        //    console.log(self.data[i]['distance_from_driver']);
        console.log(self.user_pos);

        self.deliveries.forEach(function(elem,index,array){
          var dest = elem.start_position.address;

          service.getDistanceMatrix(
            {
              origins: [origin],
              destinations: [dest],
              travelMode: 'DRIVING'
            }, function(rep){
              var dist = (rep.rows[0].elements[0].distance.text);
              elem.distance_from_driver=dist;
              if (index === array.length -1){
                self.loading=false;
              }
            });
          });
          self.$forceUpdate();
        }



      },

      mounted(){
        var self=this;
        //console.log(self);
        navigator.geolocation.getCurrentPosition(
          function(position){
            self.user_pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
            self.getDistanceFromDriver();

            //self.user_marker.setMap(self.map);
          },function(){
            alert('fail - get current pos');
          });

        }
      }
      </script>


      <style>
      </style>
