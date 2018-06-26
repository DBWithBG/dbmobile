import Vue from 'vue'
import Router from 'vue-router'
import StarRating from 'vue-star-rating'
import PullTo from 'vue-pull-to'

import Alert from '@/components/Alert'
import BackHeader from '@/components/BackHeader'
import Login from '@/components/Login'


import Demand from '@/components/customer/Demand'
import MesCourses from '@/components/customer/MesCourses'
import Menu from '@/components/customer/Menu'
import FormulaireDemande from '@/components/customer/FormulaireDemande'
import ProfileCustomer from '@/components/customer/ProfileCustomer'

import MenuDriver from '@/components/driver/MenuDriver'
import Demands from '@/components/driver/Demands'
import DemandsList from '@/components/driver/DemandsList'

Vue.use(Router);
Vue.component('db-menu',Menu);
Vue.component('db-menu-driver',MenuDriver);
Vue.component('back-header',BackHeader);
Vue.component('alert',Alert);
Vue.component('star-rating',StarRating);
Vue.component('pull-to',PullTo);

Vue.component('demande-form',FormulaireDemande);
Vue.component('profile-customer',ProfileCustomer);

export default new Router({
  mode:'history',
  routes: [
    { path: '/demande-form', component: FormulaireDemande, name:'demande-form', props:true},
    { path: '/courses', component: MesCourses},
    { path: '/demands', component : Demands},
    { path: '/demands-list', component : DemandsList, name:'demands-list', props:true},
    { path: '/demand', component : Demand},
    { path: '/profile-customer', component : ProfileCustomer},
    { path: '/', component : Login},
    { path : '*', redirect : '/'}
  ]
})
