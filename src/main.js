// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import router from './router'
import VueI18n from 'vue-i18n'
import Moment from 'moment'

import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#59A34E',
    secondary: colors.green.darken2,
    action: colors.blue.accent2,
    error: colors.red.darken2
  }
});

Vue.use(VueI18n);
Vue.use(Moment);

var i18n = new VueI18n({
  locale: 'fr', // set locale
});


/* eslint-disable no-new */
var vueApp = new Vue({
  el: '#app',
  router,
  i18n

});



document.addEventListener('deviceReady', () => {
  document.addEventListener("backbutton", function (e) {
    e.preventDefault();
  }, false);


  cordova.plugins.firebase.messaging.requestPermission().then(function(token) {
  });


    cordova.plugins.firebase.messaging.onMessage(function(payload) {

    });


    cordova.plugins.firebase.messaging.onBackgroundMessage(function(payload) {

    });


}, false)




vueApp.$mount('#app')
