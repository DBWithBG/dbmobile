<template>
  <div>
    <back-header message="Liste des demandes"> </back-header>


    <!-- vue 2.5 use slot-scope -->




    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="green"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-layout>



    <v-data-table v-if="!loading"
    :headers="headers"
    :items="deliveries_list"
    hide-actions
    item-key="id"
    >


    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <td> Dans  {{ props.item.time }} </td>
        <td class="text-xs-right"> à {{props.item.distance_from_driver}} </td>
        <td class="text-xs-right">{{ props.item.estimated_time }} minutes</td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-card-text> Prise en charge : {{props.item.start_position.address}}</v-card-text>
        <v-card-text> Livraison : {{props.item.end_position.address}}</v-card-text>
      </v-card>

      <v-content>
        <v-container grid-list-md fill-height>
          <v-layout column>

            <v-layout row wrap align-content-start>
              {{props.item.bags}}


            </v-layout>

          </v-layout>
        </v-container>
      </v-content>
      <v-btn flat color='green' @click.native="prendreEnCharge(props.item.id)">
        <span>M'engager sur cette demande</span>
      </v-btn>
    </template>
  </v-data-table>


</div>
</template>


<script>



export default {



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
        triggerDistance: 2
      },
      bags:[
        [],
        []  ,
        []
      ],
      loading:true,
      deliveries_list: [],
      user_pos:null,
      headers: [
        {
          text: 'Temps',
          align: 'left',
          value: 'time'
        },
        { text: 'Pris en charge', value: 'distance_from_driver'},
        { text: 'Temps estimé', value: 'estimated_time' }
      ],
    }
  },



  methods:{

    getDeliveries(){
      // J'utilise un alias de this pour avoir un accès aux données présentes dans 'data'
      // Autrement cet objet est overridden par les autres fonctions
      var self=this;

      $.ajax({
        url: 'https://dev-deliverbag.supconception.fr/'+'deliveries?status=1',
        dataType: 'jsonp',
        success: function(json){
          console.log(json);
          // On a récupéré les données, on effectue le traitement ici
          // On a récupéré les données, on effectue le traitement ici
          var data=JSON.parse(json);
          self.deliveries_list=data;
          self.getDistanceFromDriver();
        }
      });
    },

    prendreEnCharge(id){

      var req = {
        "mobile_token" : '12345',
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
      loaded('done')
      this.getDeliveries()
      //this.$forceUpdate();
    },

    getDistanceFromDriver(){

      var self=this;
      var origin = new google.maps.LatLng(parseFloat(self.user_pos.lat),parseFloat(self.user_pos.lng));
      var service = new google.maps.DistanceMatrixService();
      var b = new Date().valueOf();
      var msMinute = 60*1000;
      var msDay = 60*60*24*1000;
      //  self.data[i]['distance_from_driver']=self.getDistance();
      //    console.log(self.data[i]['distance_from_driver']);


      self.deliveries_list.forEach(function(elem,index,array){


        var a = new Date(elem.start_date).valueOf();

        console.log(a);
        console.log(b);

        console.log(Math.floor((a - b) / msDay) + ' full days between');
        var mins = Math.floor(((a - b) % msDay) / msMinute);
        console.log(Math.floor(((a - b) % msDay) / msMinute) + ' full minutes between');

        let h = Math.floor(mins / 60);
        let m = mins % 60;
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        elem.time=(h+':'+m);

        var bag = elem.bags;
        console.log(bag);
      //  console.log(bag[index]);

        //self.bags[bag.type_id - 1].push(bag);
      //  console.log(JSON.stringify(self.bags));



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
              setTimeout(function(){ self.$forceUpdate(); }, 1000);

            }
          });
        });

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
          self.getDeliveries();


          //self.user_marker.setMap(self.map);
        },function(){
          alert('fail - get current pos');
        });

      }
    }
    </script>


    <style>
    </style>
