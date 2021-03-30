import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import global from './assets/css/global.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.config.productionTip = false;

// import API from "./request/api";
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$API = API;

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  global,
  render: h => h(App)
}).$mount('#app')
