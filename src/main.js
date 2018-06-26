// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuetify);



/* eslint-disable no-new */
var vueApp = new Vue({
  el: '#app',
  router

})


document.addEventListener('deviceReady', () => {
  document.addEventListener("backbutton", function (e) {
    e.preventDefault();
  }, false );


  cordova.plugins.firebase.messaging.getToken().then(function(token) {
    self.firebaseToken=token;
    alert(token);
  });

  cordova.plugins.firebase.messaging.requestPermission().then(function(token) {
    alert(token);
  });

    cordova.plugins.firebase.messaging.onMessage(function(payload) {
      alert('on message')
      alert(JSON.stringify(payload));
    });

    cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {
      alert('on background message')
      alert(JSON.stringify(payload));
    });

}, false)




vueApp.$mount('#app')
