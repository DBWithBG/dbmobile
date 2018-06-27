<template>

  <v-layout row justify-center>
    <v-container fill-height>
      <v-layout row justify-center align-center>
        <v-progress-circular indeterminate :size="70" :width="5" color="green"></v-progress-circular>
      </v-layout>
    </v-container>
  </v-layout>
</template>



<script>

export default {
  data(){
    return{
      deviceId :'',
      email:'',
      pwd:'',
      isDriver:false

    }
  },

  created(){

    var self=this;
    localStorage.setItem('deviceId',"41bccd72a3d20fe5");
    self.$router.replace({path: '/demands'});
    document.addEventListener('deviceReady', () => {

      self.deviceId=device.uuid;
      var id = localStorage.getItem('deviceId');
      //navigator.splashscreen.hide();


      if (id == null){
        // on ouvre le formulaire de connexion
        // on enregistre ensuite le token sur l'espace de stockage (local storage)
        self.webviewConnexion();
      }
      else{
        // requête ajax pour récupérer l'utilisateur
        //self.getUser();
        navigator.splashscreen.hide();
        self.getUser();

      }
    }, false)

    // Pour arriver directement sur la page de demande
    //this.$router.replace({path: 'demand'});

  },




  methods:{



    getUser(){
      var self=this;
      $.ajax({
        url: 'http://dev-deliverbag.supconception.fr/'+'mobile/user/'+self.deviceId,
        type : 'GET',
        datatype : 'jsonp',
        success: function(data){

          self.sendFirebaseToken();
          if (self.user.driver != null){
            self.isDriver=true;
          }
          if (!self.isDriver){
            //self.$router.replace({path: 'demands'});
          }


          //this.$router.replace({path: 'demand'});
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
            //localStorage.getItem('deviceId') pour avoir le vrai token de l'appareil
            success: function(data){
              alert('succes');
              alert(JSON.stringify(data));
            },
            error:function(e){
              alert('error');
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
        var t= '$("#js-form-login").append("<input type=\'hidden\' id=\'deviceId\' value=\''+tok+'\'>")';
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
                localStorage.setItem('deviceId',self.deviceId);
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
        ref.executeScript({code:'(alert("loaderror"))'});
      });
    }
  }
}
</script>

<style>



[class$="--disabled"],
[class*="--disabled "] * {
  background-color: hsla(0, 1%, 1%, 0.1) !important;
}
</style>
