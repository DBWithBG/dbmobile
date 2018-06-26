<template>


  <div v-touch="{
    right:swipeRight
    }">

    <!-- Gestion des bagages -->



    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>

        <v-btn color="green lighten-1" @click.native="ajoutBagage('cabine')" dark >Ajout bagage cabine</v-btn>
        <div v-for="bag in bagagesCabine" :key="bag.id">
          <v-layout row>
            <v-flex xs2>
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesCabine, bag)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn icon flat color="teal" >
                <v-icon>photo</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs5>
              <v-text-field  required box label="nom du bagage" v-model="bag.name"
              :rules="[() => bag.name.length > 0 || 'Il est requis de nommer votre bagage']"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-text-field  box label="Description" v-model="bag.descr"></v-text-field>
            </v-flex>
          </v-layout>
          <v-divider>
          </v-divider>
        </div>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-btn  color="green lighten-1" @click.native="ajoutBagage('soute')" dark >Ajout bagage soute </v-btn>
        <div v-for="bag in bagagesSoute" :key="bag.id">
          <v-layout row>
            <v-flex xs2>
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesSoute, bag)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn icon flat color="teal" >
                <v-icon>photo</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs5>
              <v-text-field  required box label="nom du bagage" v-model="bag.name"
              :rules="[() => bag.name.length > 0 || 'Il est requis de nommer votre bagage']"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-text-field  box label="Description" v-model="bag.descr"></v-text-field>
            </v-flex>
          </v-layout>
          <v-divider>
          </v-divider>
        </div>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-btn  color="green lighten-1" @click.native="ajoutBagage('autre')" dark >Ajout bagage autre</v-btn>
        <div v-for="bag in bagagesAutre" :key="bag.id">

          <v-layout row>
            <v-flex xs2>
              <v-btn icon flat color="red darken-4" @click.native="supprBagage(bagagesAutre, bag)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn icon flat color="teal" >
                <v-icon>photo</v-icon>
              </v-btn>
            </v-flex>
            <v-flex xs5>
              <v-text-field  required box label="nom du bagage" v-model="bag.name"
              :rules="[() => bag.name.length > 0 || 'Il est requis de nommer votre bagage']"
              ></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-text-field  box label="Description" v-model="bag.descr"></v-text-field>
            </v-flex>
          </v-layout>
          <v-divider>
          </v-divider>
        </div>
      </v-flex>
    </v-layout>


    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-btn :disabled="!verifBagage()" color="green lighten-1" @click.native="updateBagages()" dark >Mettre à jour mes bagages</v-btn>
      </v-flex>
    </v-layout>

    <db-menu> </db-menu>
  </div>

</template>


<script>


export default {


  data () {
    return {
      bagagesCabine : [],
      bagagesSoute : [],
      bagagesAutre : [],
      connecting:false
    }
  },


  created(){


    this.getBagages();

    var url = "http://dev-deliverbag.supconception.fr/customers/profile?mobile_token=" + localStorage.getItem('deviceId') ;

    //var ref = cordova.InAppBrowser.open(url, '_blank', 'location=no,zoom=no');
    var tok = localStorage.getItem('deviceId');
    var t= '$("#chk_mobile_token").val("'+tok+'")';
  //  ref.executeScript( {code : t});

  },

  methods:{


    getBagages(){

    var self=this;
    $.ajax({
      url: 'http://dev-deliverbag.supconception.fr/mobile/bags/users/'+localStorage.getItem('deviceId'),
      type : 'GET',
      datatype : 'jsonp' ,
      //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
      success: function(data){

        self.connecting=true;
        self.bagagesCabine=[];
        self.bagagesSoute=[];
        self.bagagesAutre=[];
        data = JSON.parse(data);
        console.log(data);
        if (data.length){
          for (let i=0;i<data.length;i++){
            console.log(JSON.stringify(data[i]))
            switch (data[i].type_id){
              case 1 :
                self.bagagesCabine.push(data[i]);
                break;
              case 2:
                  self.bagagesSoute.push(data[i]);
                  break;
              case 3 :
                  self.bagagesAutre.push(data[i]);
                  break;

            }
          }
        }
        self.connecting=false;

      },
      error:function(e){
        alert('erreur de connexion');
        console.log(e);
        self.connecting=false;
      }
    });
  },

    ajoutBagage(type){
      switch(type){
        case 'cabine' : this.bagagesCabine.push({'name' : '' + '' , 'descr' : ''});
        break;
        case 'soute' : this.bagagesSoute.push({'name' : '' + '' , 'descr' : ''});
        break;
        case 'autre' : this.bagagesAutre.push({ 'name' : '' + '' , 'descr' : ''});
        break;
      }
    },


    supprBagage(array,obj){
      var index = array.indexOf(obj);
      if (index > -1) {
        array.splice(index, 1);
      }
    },


    updateBagages(){

      var data = {
        "bagages" : {
          '1' : this.bagagesCabine,
          '2' : this.bagagesSoute,
          '3' : this.bagagesAutre
        },
        "mobile_token" : localStorage.getItem('deviceId'),
        "_method" : "put"
      }

      console.log(JSON.stringify(data));
      var self=this;
      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/mobile/bags/users',
        type : 'POST',
        data,
        //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
        success: function(data){
          self.getBagages();
        },
        error:function(e){
          alert(e);
          console.log(e);
          self.getBagages();
        }
      });
    },

    verifBagage(){
      return  ( !this.connecting && this.bagageOk(this.bagagesAutre) && this.bagageOk(this.bagagesSoute) && this.bagageOk(this.bagagesCabine)) ;

    },

    bagageOk(tab){

      var noms=[];
      var ok=true;
      if (tab.length){
        var self=this;
        for (var i=0; i<tab.length;i++){
          if (tab[i].name == ''){
            ok=false;
          }
          else{
            if (noms.includes(tab[i].name)){
              ok=false;
            }
            else{
              noms.push(tab[i].name)
            }
          }
        }
      }
      return ok;
    },

    swipeRight(){
      this.$router.replace({path: 'demand'});
    }
  }
}


</script>

<style>


</style>
