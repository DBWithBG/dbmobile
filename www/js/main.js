import Vue from 'vue'
import Vuetify from 'vuetify'
import VueRouter from 'vue-router'
import VueI18n from 'vue-i18n'
import Lang from './lang'
import moment from 'moment'
import VueSweetAlert from 'vue-sweetalert'

import Root from './components/Root.vue'
import Landing from './components/Landing.vue'
import Login from './components/login/Login.vue'
import RegisterChoice from './components/register/RegisterChoice.vue'
import RegisterCustomer from './components/register/RegisterCustomer.vue'
import RegisterDriver from './components/register/RegisterDriver.vue'
import DemandChoice from './components/customer/DemandChoice.vue'
import MyDeliveries from './components/customer/MyDeliveries.vue'
import Settings from './components/customer/Settings.vue'
import MyBags from './components/customer/MyBags.vue'
import DemandForm from './components/customer/DemandForm.vue'
import Profile from './components/customer/Profile.vue'
import ConfirmEmail from './components/ConfirmEmail.vue'

import DemandsDriver from './components/driver/Demands.vue'
import DemandsListDriver from './components/driver/DemandsList.vue'
import MyDeliveriesDriver from './components/driver/MyDeliveries.vue'
import SettingsDriver from './components/driver/Settings.vue'
import ConfirmDriver from './components/ConfirmDriver.vue'


Vue.use(VueRouter);
Vue.use(VueI18n);
Vue.use(Vuetify, { theme: { primary: '#3EB93A' } });
Vue.use(VueSweetAlert);

moment.locale('fr');
Vue.prototype.moment = moment;

// Routes 

const routes = [
  // Général
  { name: 'Root', path: '/', component: Root },
  { name: 'Landing', path: '/landing', component: Landing },
  { name: 'Login', path: '/login', component: Login },
  { name: 'RegisterChoice', path: '/register-choice', component: RegisterChoice },
  { name: 'RegisterCustomer', path: '/register-customer', component: RegisterCustomer },
  { name: 'RegisterDriver', path: '/register-driver', component: RegisterDriver },
  { name: 'Profile', path: '/profile', component: Profile },

  // Customer
  { name: 'DemandChoice', path: '/demand-choice', component: DemandChoice },
  { name: 'MyDeliveries', path: '/my-deliveries', component: MyDeliveries },
  { name: 'Settings', path: '/settings', component: Settings },
  { name: 'MyBags', path: '/my-bags', component: MyBags },
  { name: 'DemandForm', path: '/demand-form', component: DemandForm, props: true },
  { name: 'ConfirmEmail', path: '/confirm-email', component: ConfirmEmail },

  // Driver
  { name: 'DemandsDriver', path: '/demands-driver', component: DemandsDriver },
  { name: 'DemandsListDriver', path: '/demands-list-driver', component: DemandsListDriver },
  { name: 'MyDeliveriesDriver', path: '/my-deliveries-driver', component: MyDeliveriesDriver },
  { name: 'SettingsDriver', path: '/settings-driver', component: SettingsDriver },
  { name: 'ConfirmDriver', path: '/confirm-driver', component: ConfirmDriver }
];

const router = new VueRouter({ routes: routes });

const i18n = new VueI18n({ locale: 'fr', messages: Lang })

function bindVue() {
  console.log("Binding vue app to #app");
  new Vue({
    el: '#app',
    router,
    i18n
  });
}


document.addEventListener('deviceready', bindVue);
// document.addEventListener('DOMContentLoaded', bindVue);
