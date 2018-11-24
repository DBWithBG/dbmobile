import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import Lang from './lang'
import moment from 'moment'

import Root from './components/Root.vue'
import Login from './components/login/Login.vue'
import RegisterChoice from './components/register/RegisterChoice.vue'
import RegisterCustomer from './components/register/RegisterCustomer.vue'
import RegisterDriver from './components/register/RegisterDriver.vue'
import DemandChoice from './components/customer/DemandChoice.vue'
import MyCourses from './components/customer/MyCourses.vue'
import Settings from './components/customer/Settings.vue'
import MyBags from './components/customer/MyBags.vue'
import DemandForm from './components/customer/DemandForm.vue'

Vue.use(VueRouter)
Vue.use(VueI18n)
Vue.use(Vuetify, { theme: { primary: '#3EB93A'}});

moment.locale('fr');
Vue.prototype.moment =  moment ;

// Routes 

const routes = [
  { path: '/', component: Root },
  { path: '/login', component: Login },
  { path: '/register-choice', component: RegisterChoice },
  { path: '/register-customer', component: RegisterCustomer },
  { path: '/register-driver', component: RegisterDriver },
  { path: '/demand-choice', component : DemandChoice},
  { path: '/my-courses', component: MyCourses},
  { path: '/settings', component: Settings},
  { path: '/my-bags', component: MyBags},
  { path: '/demand-form', component: DemandForm}
];

const router = new VueRouter({routes: routes});

const i18n = new VueI18n({ locale: 'fr', messages: Lang})

function bindVue() {
  console.log("Binding vue app to #app")
  new Vue({
    el: '#app',
    router,
    i18n
  });
} 

// L'event deviceready n'éxiste que dans cordova
// Étant donné qu'on dev avec webpack/webpack-dev-server, on utilise l'event DOMContentLoaded
// TODO : changer quand on build l'app android/ios :/
// document.addEventListener('deviceready', bindVue);
document.addEventListener('DOMContentLoaded', bindVue);
