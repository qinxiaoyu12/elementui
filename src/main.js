import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import global from './assets/css/global.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false;

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,
  global,
  render: h => h(App)
}).$mount('#app')
