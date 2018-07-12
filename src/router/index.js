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
import Settings from '@/components/customer/Settings'
import MyBags from '@/components/customer/MyBags'

import MenuDriver from '@/components/driver/MenuDriver'
import Demands from '@/components/driver/Demands'
import DemandsList from '@/components/driver/DemandsList'
import MesCoursesDriver from '@/components/driver/MesCoursesDriver'
import SettingsDriver from '@/components/driver/SettingsDriver'

import StaticMap from 'vue-static-map';

Vue.use(Router);
Vue.component('db-menu',Menu);
Vue.component('db-menu-driver',MenuDriver);
Vue.component('back-header',BackHeader);
Vue.component('alert',Alert);
Vue.component('star-rating',StarRating);
Vue.component('pull-to',PullTo);

Vue.component('demande-form',FormulaireDemande);
Vue.component('my-bags',MyBags);
Vue.component('demands-list',DemandsList);
Vue.component('demand',Demand);

Vue.component('static-map',StaticMap);

export default new Router({
  mode:'history',
  routes: [
    { path: '/demande-form', component: FormulaireDemande, name:'demande-form', props:true},
    { path: '/courses', component: MesCourses},
    { path: '/courses-driver', component: MesCoursesDriver},
    { path: '/demands', component : Demands},
    { path: '/demands-list', component : DemandsList, name:'demands-list', props:true},
    { path: '/demand', component : Demand},
    { path: '/settings', component : Settings},
    { path: '/settings-driver', component : SettingsDriver},
    { path: '/my-bags', component : MyBags},
    { path: '/', component : Login},
    { path : '*', redirect : '/'}
  ]
})
