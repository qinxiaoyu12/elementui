import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import global from './assets/css/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  global,
  render: h => h(App)
}).$mount('#app')
