

var Vue = require('vue');
var Vuetify = require('vuetify')
var VueRouter = require('vue-router');


// var Reload = require('vue-hot-reload-api');
//var VueResource = require('vue-resource');
var Main = require('./components/Main.vue');
var myMap = require('./components/Map.vue');
var demand = require('./components/Demand.vue');
var address = require('./components/Address.vue');
var train = require('./components/Train.vue');
var flight = require('./components/Flight.vue');
var demandNext = require('./components/DemandNext.vue');
var alert = require('./components/Alert.vue');
var menu = require('./components/Menu.vue');
var courses = require('./components/MesCourses.vue');


Vue.use(VueRouter);



Vue.use(Vuetify, {
  theme: {
    primary: '#3EB93A',
  }
});

Vue.use(require('vue-moment'));


//Vuetify.theme.primary = '#3EB93A'

//Vue.use(VueRessource);

const routes = [
  { path: '/courses', component: courses},
  { path: '/demands', component : myMap},
  { path: '/demand', component : demand},
  { path: '/demand-address', component : address},
  { path: '/demand-train', component : train},
  { path: '/demand-flight', component : flight},
  { path: '/demand-next', component : demandNext, name:'demand-next' , props:true},
  { path: '/', component : Main}

];

const router = new VueRouter({
  routes: routes
});

document.addEventListener('deviceready', function () {
  console.log(navigator.splashscreen);
    navigator.splashscreen.hide();
  var vm = new Vue({
    el: '#Myapp',
    router: router,
  //On référence le composant home dans notre vue, attention le nom 'home-component' doit être ne Kebab case
    components: {
      'db-component': Main,
      'db-menu' : menu

    }
  });



});




/*
import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './components/Main.vue';

Vue.use(VueRouter);

var vm = new Vue({
  el: 'body',
//On référence le composant home dans notre vue, attention le nom 'home-component' doit être ne Kebab case
  components: {
    'main-component': Main
  }
});
*/
