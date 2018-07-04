<template>

  <div>
       {{this.$i18n.locale}}
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
          <v-data-table :headers="headers" :items="tab" hide-actions class="elevation-1" hide-headers>
          <template slot="items" slot-scope="props">
            <v-expansion-panel>
              <v-expansion-panel-content>
                <div slot="header">{{$t("suivi_course")}} {{props.item.id}}</div>
                <div v-if="props.item.status === 5 && !ratingSent">
                  <v-layout row>
                    <star-rating v-model="props.item.rating" :show-rating="false" @click.native.stop="dialogRating = true" @click.native="sendRating(props.item.id,props.item.rating)"> </star-rating>
                    <v-dialog v-model="dialogRating" max-width="290">
                      <v-card>
                        <v-card-title class="headline">{{$t("rating")}}</v-card-title>
                        <v-layout row>
                          <v-flex xs10 offset-xs1>
                            <v-text-field v-bind:label="$t('rating_label')" v-model="props.item.details"> </v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-btn  flat color="green darken-2" @click.native="sendRating(props.item.id,props.item.rating,props.item.details),dialogRating = false">
                          <span>{{$t("rating_button")}}</span>
                        </v-btn>
                      </v-card>
                    </v-dialog>
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
                  <v-btn flat color='green' @click.native="detailsCourse(props.item.id)">
                    <span> {{$t("suivi_course")}}</span>
                  </v-btn>
                </v-flex>
                <v-layout>
                  <v-flex row xs12 v-if="props.item.status === 1">
                    <v-btn flat color='red' @click.native.stop="dialogDel = true">
                      <span> {{$t("cancel_course")}}</span>
                    </v-btn>

                  </v-flex>
                </v-layout>
              </v-expansion-panel-content>
            </v-expansion-panel>
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
      <v-btn color="primary" flat @click.native="dialogDel =false">
        <span> {{$t("cancel")}}</span>
      </v-btn>
      <v-btn color="green darken-2" flat @click.native="dialogDel=false,cancelDelivery(props.item.id)">
        <span> {{$t("delete")}}</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>


<db-menu> </db-menu>
</div>

</template>


<script>


export default {


  data () {
    return {
      ratingSent:false,
      headers: [
        { text: this.$i18n.t("distance"), value: 'distance' },
        { text: this.$i18n.t("prix"), value: 'price' },
        { text: this.$i18n.t("temps_estime"), value: 'estimated_time' },
      ],
      dialogRating:false,
      dialogDel:false,
      tabs: [this.$i18n.t("tab_en_cours"), this.$i18n.t("tab_en_attente"), this.$i18n.t("tab_passees")],
      demandes: [[],[],[]],
      ratingLabel: this.$i18n.t("rating_label")
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

  <style>

  tbody li {
    width:100vw;
  }
  </style>


  <i18n>
  {
    "fr": {
      "tab_en_cours": "En cours",
      "tab_en_attente":"En attente",
      "tab_passees" : "Passées",
      "details_course":"Détails de la course",
      "suivi_course" : "Suivi de la course",
      "cancel_course":"Annuler ma demande",
      "cancel":"Annuler",
      "delete" : "Supprimer",
      "rating" : "Notation de la course",
      "rating_button" : "Envoyer mon avis",
      "rating_label" : "Commentaire",
      "delete_ask" : "Souhaitez-vous vraiment annuler votre demande?",
      "delete_info" : "Cette action est irreversible",
      "distance" : "Distance",
      "prix" : "Prix" ,
      "temps_estime" : "Temps estimé"
    },
    "en": {
      "tab_en_cours": "Ongoing",
      "tab_en_attente":"Pending",
      "tab_passees" : "Past",
      "details_course":"Course details ",
      "suivi_course" : "Track my course",
      "cancel_course":"Cancel my order",
      "cancel":"Cancel",
      "delete" : "Delete",
      "rating" : "Course rating",
      "rating_button" : "Send my opinion",
      "rating_label" : "Comment",
      "delete_ask" : "Do you really want to cancel your order?",
      "delete_info" : "This can't be undone",
      "distance" : "Distance",
      "prix" : "Price" ,
      "temps_estime" : "Estimated time"
    }
  }
  </i18n>
