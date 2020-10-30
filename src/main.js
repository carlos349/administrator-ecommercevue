
import Vue from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import VueSweetalert2 from 'vue-sweetalert2';
import 'ant-design-vue/dist/antd.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueCarousel from 'vue-carousel'; 
import { library } from '@fortawesome/fontawesome-svg-core'
import { faDollarSign, faEdit, faPercentage, faBoxes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faDollarSign, faEdit, faPercentage, faBoxes )
 
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Vue.use(VueSweetalert2);
Vue.use(Antd);
Vue.use(ArgonDashboard)
Vue.use(VueCarousel);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
