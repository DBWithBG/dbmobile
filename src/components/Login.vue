<template>

  <v-layout row justify-center>
    <v-container fill-height>
      {{firebaseToken}}
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
      firebaseToken:'',
      deviceId :'',
      email:'',
      pwd:'',
      user:{},
      isDriver:false

    }
  },

  created(){

    var self=this;
    localStorage.setItem('deviceId',"41bccd72a3d20fe5");
    //self.$router.replace({path: '/demands'});
    document.addEventListener('deviceReady', () => {

      self.deviceId=device.uuid;
      var id = localStorage.getItem('deviceId');
      navigator.splashscreen.hide();
      if (id == null){
        // on ouvre le formulaire de connexion
        // on enregistre ensuite le token sur l'espace de stockage (local storage)
        //  self.webviewConnexion();
      }
      else{
        // requête ajax pour récupérer l'utilisateur
        //self.getUser();
        //navigator.splashscreen.hide();
        //self.getUser();

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
          self.user=data;
          if (self.user.driver != null){
            self.isDriver=true;
          }
          if (!self.isDriver){
            self.$router.replace({path: 'demand'});
          }


          //this.$router.replace({path: 'demand'});
        },
        error:function(e){
          console.log(e);
        }

      });


    },
    /*
    login(){
    var self=this;
    alert(ref.document[js-form-login].email) ;
    alert(ref.document[js-form-login].pwd) ;
    self.email =ref.document[js-form-login].email;
    self.pwd =ref.document[js-form-login].password;
    var response = {
    "email" : self.email,
    "password":self.pwd,
    "mobile_token" : this.deviceId
  };
  $.ajax({
  url: 'http://dev-deliverbag.supconception.fr/'+'mobile/login',
  type : 'POST',
  data : {"response" : response},
  success: function(data){
  self.user=data;

},
error:function(e){
console.log(e);
}

});


},
*/
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

body {
  padding-bottom:40px;
}


[class$="--disabled"],
[class*="--disabled "] * {
  background-color: hsla(0, 1%, 1%, 0.1) !important;
}
</style>
