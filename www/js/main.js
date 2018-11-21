import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'

import Home from './components/Home.vue'
import Menu from './components/Menu.vue'
import Demand from './components/Demand.vue'
import MyMap from './components/Map.vue'
import Address from './components/Address.vue'
import Train from './components/Train.vue'
import Flight from './components/Flight.vue'
import DemandNext from './components/DemandNext.vue'
import Courses from './components/MesCourses.vue'

Vue.use(VueRouter);

Vue.use(Vuetify, {
  theme: {
    primary: '#3EB93A',
  }
});

Vue.use(require('vue-moment'));

const routes = [
  { path: '/', component: Home },
  { path: '/demand', component : Demand},
  { path: '/courses', component: Courses},
  { path: '/demands', component : MyMap},
  { path: '/demand-address', component : Address},
  { path: '/demand-train', component : Train},
  { path: '/demand-flight', component : Flight},
  { path: '/demand-next', component : DemandNext, name:'demand-next' , props:true}
];

const router = new VueRouter({
  routes: routes
});

function bindVue() {
  console.log("Binding vue app to #app")
  new Vue({
    el: '#app',
    router: router,
    components: {
      'db-menu': Menu
    }
  });
} 

// L'event deviceready n'éxiste que dans cordova
// Étant donné qu'on dev avec webpack/webpack-dev-server, on utilise l'event DOMContentLoaded
// TODO : changer quand on build l'app android/ios :/
// document.addEventListener('deviceready', bindVue);
document.addEventListener('DOMContentLoaded', bindVue);
