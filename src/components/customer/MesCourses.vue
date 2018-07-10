<template>

  <div>

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
      <v-tabs fixed-tabs>
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
                <div slot="header">{{$t("suivi_course")}} {{props.item.id}}</div>
                <div v-if="props.item.status === 5 && !ratingSent">
                  <v-layout row>
                    <star-rating v-model="props.item.rating" :show-rating="false" @click.native.stop="active=props.item,dialogRating = true" @click.native="sendRating(props.item.id,props.item.rating)"> </star-rating>

                  </v-layout>
                </div>

                <v-flex row xs12>
                  <v-layout align-center justify-space-around>
                    <td> {{ props.item.start_position.address }} </td>
                      <v-icon align-center>arrow_forward</v-icon>
                    <td> {{ props.item.end_position.address }} </td>
                  </v-layout>
                </v-flex>
                  <br>
                <v-flex row xs12>
                  <v-btn flat color='primary' @click.native="detailsCourse(props.item.id)">
                    <span> {{$t("suivi_course")}}</span>
                  </v-btn>
                </v-flex>
                <v-layout>
                  <v-flex row xs12 v-if="props.item.status === 1">
                    <v-btn flat color='error' @click.native.stop="active=props.item,dialogDel = true">
                      <span> {{$t("cancel_course")}}</span>
                    </v-btn>

                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </template>

          <template slot="no-data">
            {{$t('courses_empty')}}
          </template>
        </v-data-table>

      </v-tab-item>
    </v-tabs-items>
  </v-tabs>

</div>


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


<v-dialog v-model="dialogRating" max-width="290">
  <v-card>
    <v-card-title class="headline">{{$t("rating")}}</v-card-title>
    <v-layout row>
      <v-flex xs10 offset-xs1>
        <v-text-field v-bind:label="$t('rating_label')" v-model="active.details"> </v-text-field>
      </v-flex>
    </v-layout>
    <v-btn  flat color="primary" @click.native="sendRating(active.id,active.rating,active.details),dialogRating = false">
      <span>{{$t("rating_button")}}</span>
    </v-btn>
  </v-card>
</v-dialog>


<db-menu> </db-menu>
</div>

</template>


<script>


export default {


  data () {
    return {
      loading:true,
      ratingSent:false,
      active:'',
      headers: [
        { text: this.$i18n.t("distance"), value: 'distance' },
        { text: this.$i18n.t("prix"), value: 'price' },
        { text: this.$i18n.t("temps_estime"), value: 'estimated_time' },
      ],
      dialogRating:false,
      dialogDel:false,
      tabs: [this.$i18n.t("tab_en_cours"), this.$i18n.t("tab_en_attente"), this.$i18n.t("tab_passees")],
      demandes: [[],[],[]]
      }
    },


    mounted(){

      let self=this;
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
          self.loading=false;
          self.$forceUpdate();

        },
        error:function(e){
          alert(e);
          console.log(e);
        }
      });

    },

    methods:{


      cancelDelivery(id){
        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/customers/deliveries/cancelDelivery',
          type : 'POST',
          data : {
            "delivery_id" : id,
            "mobile_token" : localStorage.getItem('deviceId')
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
          //  self.demandes[1].delete()
            console.log(data);
          },
          error:function(e){
            console.log(e);
          }
        });
      },

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
            console.log(e);
          }
        });
      },
      swipeLeft(){
        this.$router.replace({path: 'demand'});
      },
      detailsCourse(id){
        let ref = window.open('http://dev-deliverbag.supconception.fr/mobile/deliveries/'+id+'?mobile_token='+localStorage.getItem('deviceId'), '_blank', 'location=no,zoom=no',);

      }
    }
  }


  </script>
<i18n src='@/assets/trad.json'></i18n>
  <style>

  tbody li {
    width:100vw;
  }
  </style>
