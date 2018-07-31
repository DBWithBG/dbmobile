<template>

  <v-layout row justify-center>
    <v-container fill-height>
      <v-layout row justify-center align-center>
        <v-progress-circular indeterminate :size="70" :width="5" color="primary"></v-progress-circular>
      </v-layout>
    </v-container>
  </v-layout>
</template>


<script>

export default {
  data(){
    return{
      deviceId :'',
      isDriver:false

    }
  },

  created(){

    var self=this;
  //  localStorage.setItem('deviceId',"41bccd72a3d20fe5");
  //  self.$router.replace({path: '/demands'});
    document.addEventListener('deviceReady', () => {

      self.deviceId=device.uuid;
      var id = localStorage.getItem('deviceId');
      //navigator.splashscreen.hide();
      if (id != null){
        self.getUser();
      }
      else {
        self.webviewConnexion();
      }
      /*
      if (id == null){
      // on ouvre le formulaire de connexion
      // on enregistre ensuite le token sur l'espace de stockage (local storage)

    }
    else{
    // requête ajax pour récupérer l'utilisateur
    //self.getUser();
    navigator.splashscreen.hide();
    self.getUser();

  }
  */
}, false)

// Pour arriver directement sur la page de demande
//this.$router.replace({path: 'demand'});

},




methods:{



  getUser(){
    var self=this;
    localStorage.setItem('deviceId',self.deviceId);
    $.ajax({
      url: 'http://dev-deliverbag.supconception.fr/mobile/user/'+self.deviceId,
      type : 'GET',
      datatype : 'jsonp',
      success: function(data){
        data=JSON.parse(data);
        self.sendFirebaseToken();
        if (data.driver != null){
          self.$router.replace({path: 'demands'});
          navigator.splashscreen.hide();
        }
        else{
          self.$router.replace({path: 'demand'});
          navigator.splashscreen.hide();

        }

      },
      error:function(e){
        console.log(e);
      }

    });


  },

  sendFirebaseToken(){

    var self=this;
    var tok='';
    cordova.plugins.firebase.messaging.getToken().then(function(token) {
      var data = {
        "mobile_token" : localStorage.getItem('deviceId'),
        "notify_token": token,
        "_method" : "put"
      }

      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/mobile/users/refreshNotifyToken',
        type : 'POST',
        data,
        success: function(data){
          console.log(data);
        },
        error:function(e){

        }
      });
    });


  },

  webviewConnexion(){
    var self=this;
    var ref = cordova.InAppBrowser.open('http://dev-deliverbag.supconception.fr/connexion', '_blank', 'location=no,zoom=no',);
    var tok = this.deviceId;
    ref.addEventListener('loadstop', function(){
      navigator.splashscreen.hide();
      var t= '$("form").append("<input name=\'mobile_token\' type=\'hidden\' id=\'deviceId\' value=\''+tok+'\'>")';
      ref.executeScript( {code : t});
      var i = window.setInterval(function(){
        ref.executeScript(
          /*{file:"inject2.js" }, function(value){
          alert(value);
        }*/
        {
          code:'if($("#test").val()=="ok"){true}else{false}'},
          function(val){
            if (val != 'false'){
              self.getUser();
              ref.close();
              //ajax
            }
          }

        );
      },2000);

      ref.executeScript({file:"js/mobile/inject.js" });
    });

    ref.addEventListener('loaderror', function(){
      ref.executeScript({code:'Erreur chargement page web'});
    });
  }
}
}
</script>

<style>



[class$="--disabled"],
[class*="--disabled "] * {
  color: #757575 !important;
}

input:focus {
  outline:  none;
}



</style>
