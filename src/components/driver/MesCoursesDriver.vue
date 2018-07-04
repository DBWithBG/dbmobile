<template>

  <div>

    <v-layout v-if="loading" row justify-center>
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="5" color="green"></v-progress-circular>
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
                <v-expansion-panel-content :value="open == props.item.delivery.id">
                  <div slot="header">Le {{props.item.delivery.start_date_formatted.slice(0,18)}}</div>

                  <v-flex row xs12>
                    <v-layout align-center justify-space-around>

                      <v-flex row xs5> {{ props.item.delivery.start_position.address }} </v-flex>

                      <v-flex row xs2>
                        <v-icon align-center>arrow_forward</v-icon>
                      </v-flex>

                      <v-flex row xs5> {{ props.item.delivery.end_position.address }} </v-flex>

                    </v-layout>

                    <v-list class="mt-4" subheader>
                      <v-subheader> {{props.item.delivery.bags.length}} bagages</v-subheader>
                      <v-layout column>
                        <v-flex v-for="bag in props.item.delivery.bags" :key="bag.id">

                          <v-chip xs6 v-if="bag.type_id===1" color="teal lighten-2" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                            <v-dialog v-model="detailBag" max-width="290">
                              <v-card>
                                <v-card-title class="headline">Détail de ce bagage</v-card-title>
                                <v-layout row>
                                  <v-flex xs10 offset-xs1>
                                    <div v-if="modelBag.details">
                                      {{modelBag.details}}
                                    </div>
                                    <div v-else>
                                      Aucune description n'a été indiquée par le client
                                    </div>
                                  </v-flex>
                                </v-layout>
                              </v-card>
                            </v-dialog>
                            {{bag.name}}
                            <v-icon right>work</v-icon>
                          </v-chip>

                          <v-chip v-if="bag.type_id===2" color="teal darken-1" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                            {{bag.name}}
                            <v-icon right>work</v-icon>
                          </v-chip>

                          <v-chip v-if="bag.type_id===3" color="teal darken-4" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                            {{bag.name}}
                            <v-icon right>work</v-icon>
                          </v-chip>

                        </v-flex>
                      </v-layout>
                    </v-list>
                  </v-flex>

                  <div v-if="props.item.delivery.status === 2">
                    <v-btn small flat color="error" @click.native.stop="dialogDel = true,active=props.item.delivery">
                      Annuler ma course
                    </v-btn>

                    <v-btn  small flat color="action" @click.native.stop="takeBag(props.item.delivery)">
                      Confirmer la prise des bagages
                    </v-btn>

                  </div>

                  <div v-if="props.item.delivery.status === 3">
                    <v-btn small flat color="action" @click.native.stop="endCourse(props.item.delivery)">
                      Livrer les bagages
                    </v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>


            </template>



          </v-data-table>

        

      <v-dialog v-model="dialogDel" max-width="290">
        <v-card>
          <v-card-title class="headline">Annuler votre prise en charge</v-card-title>

          <v-card-text>
            Souhaitez vous vraiment annuler votre prise en charge?
          </v-card-text>
          <v-card-text>
            Cette action entrainera des pénalités si la course devait avoir lieu bientôt.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="action" flat @click.native.stop="dialogDel =false">Retour</v-btn>
            <v-btn color="error" flat @click.native.stop="dialogDel=false,cancelTakeover(active)">Supprimer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    </v-tab-item>
  </v-tabs-items>

</v-tabs>

</div>




<db-menu-driver> </db-menu-driver>
</div>

</template>


<script>


export default {


  data () {
    return {
      open:-1,
      snackbar:false,
      headers: [
        { text: 'Distance', value: 'distance' },
        { text: 'Prix', value: 'price' },
        { text: 'Temps estimé', value: 'estimated_time' },
      ],

      deviceid:'',
      dialogDel:false,
      tabs: [
        'En cours', 'Passées'],
        demandes: [
          [],
          []
        ],
        day:'',
        active:'',
        loading:true,
        detailBag:false,
        modelBag:''
      }
    },


    mounted(){
      this.getCourses();

    },

    methods:{


      getCourses(){

        let self=this;


        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/drivers?mobile_token='+'12345',
          type : 'GET',
          datatype:'jsonp',
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            console.log(data);
            data.forEach(function(elem,index,array){
              elem.delivery.start_date_formatted=new Date(elem.delivery.start_date).toLocaleString();
              switch(elem.delivery.status){
                case 2 : self.demandes[0].push(elem);
                break;
                case 3 : self.demandes[0].push(elem);
                break;
                case 4 : self.demandes[0].push(elem);
                break;
                case 5 : self.demandes[1].push(elem);
              }
              if (index === array.length -1){
                self.loading=false;
                setTimeout(function(){ self.$forceUpdate(); }, 1000);
              }
            });

            self.demandes[0].sort(function(a,b){
              return new Date(a.delivery.start_date) - new Date(b.delivery.start_date)
            });

            self.demandes[1].sort(function(a,b){
              return new Date(b.delivery.start_date) - new Date(a.delivery.start_date)
            });





          },
          error:function(e){
            alert(e);
            console.log(e);
          }
        });
      },


      cancelTakeover(delivery){
        let self=this;
        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status',
          type : 'POST',
          data : {
            "delivery_id" : delivery.id,
            "status_id" : "1",
            "mobile_token" : '12345'
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
          },
          error:function(e){
            console.log(e);
          }
        });
      },


      takeBag(delivery){
        let self=this;
        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status',
          type : 'POST',
          data : {
            "delivery_id" : delivery.id,
            "status_id" : "3",
            "mobile_token" : '12345'
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
            self.open=delivery.id;
            self.snackbar=true;

            //self.$forceUpdate();
          },
          error:function(e){
            console.log(e);
          }
        });
      },

      endCourse(delivery){
        let self=this;
        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status',
          type : 'POST',
          data : {
            "status_id" : '5',
            "delivery_id" : delivery.id,
            "mobile_token" : '12345'
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){

            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
            self.open=delivery.id;
            self.snackbar=true;
          },
          error:function(e){
            console.log(e);
          }
        });

      },

      bagStateTake(id,rating,com){

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
        this.$router.replace({path: 'demands'});
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
