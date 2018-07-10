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
                            {{bag.name}}
                            <v-icon right>work</v-icon>
                          </v-chip>
                          <v-chip xs6 v-if="bag.type_id===1" color="teal lighten-2" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
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
                    <v-btn small flat color="error" @click.native.stop="dialogDel=true, active=props.item.delivery">
                      {{$t('cancel_course')}}
                    </v-btn>

                    <v-btn  small flat color="action" @click.native.stop="dialogBag=true, active=props.item.delivery">
                      {{$t('take_bags')}}
                    </v-btn>

                  </div>

                  <div v-if="props.item.delivery.status === 3">
                    <v-btn small flat color="action" @click.native.stop="endCourse(props.item.delivery)">
                      {{$t('deliver_bags')}}
                    </v-btn>
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>


            </template>

            <template slot="no-data">
              {{$t('courses_empty')}}
            </template>


          </v-data-table>



      <v-dialog v-model="dialogDel" max-width="290">
        <v-card>
          <v-card-title class="headline">{{$t('cancel_takeover')}}</v-card-title>

          <v-card-text>
            {{$t('cancel_takeover_confirm')}}
          </v-card-text>
          <v-card-text>
            {{$t('cancel_takeover_info')}}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="action" flat @click.native.stop="dialogDel=false">{{$t('cancel')}}</v-btn>
            <v-btn color="error" flat @click.native.stop="dialogDel=false,cancelTakeover(active)">{{$t('delete')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>



      <v-dialog v-model="detailBag" max-width="290">
        <v-card>
          <v-card-title class="headline">{{$t('details_bag')}}</v-card-title>
          <v-layout row>
            <v-flex xs10 offset-xs1>
              <div v-if="modelBag.details">
                {{modelBag.details}}
              </div>
              <div v-else>
                {{$t('descr_empty')}}
              </div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogBag" max-width="290">
        <v-card>
          <v-layout column>
            <v-flex v-for="bag in active.bags" :key="bag.id">
              <div class="text-xs-center" v-if="bag.type_id===1" >
              <v-chip xs6 color="teal lighten-2" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                {{bag.name}}
                <v-icon right>work</v-icon>
              </v-chip>
              <v-text-field  box label="État du bagage" v-model="bag.edl"></v-text-field>
            </div>

            <div class="text-xs-center" v-if="bag.type_id===2" >
              <v-chip color="teal darken-1" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                {{bag.name}}
                  <v-icon right>work</v-icon>
              </v-chip>
              <v-text-field  box label="État du bagage" v-model="bag.edl"></v-text-field>
              </div>

              <div class="text-xs-center" v-if="bag.type_id===3" >
              <v-chip color="teal darken-4" text-color="white" @click.native.stop="detailBag=true,modelBag=bag">
                {{bag.name}}
                <v-icon right>work</v-icon>
              </v-chip>
              <v-text-field  box label="État du bagage" v-model="bag.edl"></v-text-field>
              </div>

              </v-flex>
              <v-btn :disabled="!edlOk()" class="text-xs-center" color="primary" @click.native.stop="edlBags(active.bags)">Valider </v-btn>
          </v-layout>
        </v-card>
      </v-dialog>


    <v-snackbar v-model="snackbar" color="primary" bottom>
      {{snackbarText}}
    </v-snackbar>


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
      snackbar:'',
      snackbarText:'',
      headers: [
        { text: this.$i18n.t("distance"), value: 'distance' },
        { text: this.$i18n.t("prix"), value: 'price' },
        { text: this.$i18n.t("estimated_time"), value: 'estimated_time' },
      ],

      deviceid:'',
      dialogDel:false,
      dialogBag:false,
      tabs: [
        this.$i18n.t('tab_en_cours'), this.$i18n.t('tab_passees')],
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

      edlOk(){
        let ok=true;
        if (this.active != ''){
          this.active.bags.forEach(function(elem){
            if (elem.edl.length<0){
              ok=false;
            }
          });
        }
        else{
          ok=false;
        }
        return ok;
      },

      getCourses(){

        let self=this;


        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/deliveries/drivers?mobile_token='+localStorage.getItem('deviceId'),
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
            "mobile_token" : localStorage.getItem('deviceId')
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
            self.snackbar=true;
            self.snackbarText=self.$i18n.t("snackBar_cancel")
          },
          error:function(e){
            console.log(e);
          }
        });
      },

      rateBag(bag){

      },


      edlBags(bags){
        let self=this;
        var details = [];
        self.active.bags.forEach(function(elem){
          details.push(
            {
              "bag_id" : elem.pivot.bag_id,
              "detail" : elem.edl
            }
          );
        });


        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/infobags/edit',
          type : 'POST',
          data : {
            "delivery_id" : self.active.id,
            "details" : details,
            "mobile_token" : '41bccd72a3d20fe5',
            "_method":"put"
          },
          success:function(data){
            self.dialogBag=false;
            self.takeBag();
          },
          error:function(e){
            console.log(e);
          }
        });
      },


      takeBag(){

        let self=this;
        $.ajax({
          url: 'http://dev-deliverbag.supconception.fr/mobile/drivers/deliveries/edit-status',
          type : 'POST',
          data : {
            "delivery_id" : self.active.id,
            "status_id" : "3",
            "mobile_token" : localStorage.getItem('deviceId')
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){
            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
            self.open=self.active.id;
            self.snackbar=true;
            self.snackbarText=self.$i18n.t("snackBar_bags");


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
            "mobile_token" : localStorage.getItem('deviceId')
          },
          //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
          success: function(data){

            self.demandes=[
              [],[],[]
            ];
            self.getCourses();
            self.open=delivery.id;
            self.snackbar=true;
            self.snackbarText=self.$i18n.t("snackBar_dest")
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

  <i18n src='@/assets/trad.json'></i18n>
