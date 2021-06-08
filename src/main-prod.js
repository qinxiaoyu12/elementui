import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import global from './assets/css/global.css';
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import {MessageBox} from 'element-ui';
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
//全局导入富文本编辑器
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// //导入进度条
import NProgress from 'nprogress' // 引入nprogress插件
// import 'nprogress/nprogress.css'  // 这个nprogress样式必须引入

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.config.productionTip = false;
Vue.component('tree-table', TreeTable)
Vue.prototype.$confirm = MessageBox.confirm;
Vue.filter('timeDateFilter', function (timeDate) {
    let tt = new Date(timeDate * 1000);
    let Y = tt.getFullYear() + '-';
    let M = ((tt.getMonth() + 1 < 10 ? '0' + (tt.getMonth() + 1) : tt.getMonth() + 1) + '').padStart(2, '0') + '-';
    let D = ((tt.getDate() + '').padStart(2, '0')) + ' ';
    let h = ((tt.getHours() + '').padStart(2, '0')) + ':';
    let m = ((tt.getMinutes() + '').padStart(2, '0')) + ':';
    let s = (tt.getSeconds() + '').padStart(2, '0');
    return `${Y}${M}${D} ${h}${m}${s}`
})

// import API from "./request/api";
Vue.prototype.$axios = axios;
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$API = API;
axios.interceptors.request.use(config => {
    NProgress.start();
    // console.log(config);
    //在发送请求之前做些什么
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
})

axios.interceptors.response.use(config => {
    NProgress.done();
    return config;
})

Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    store,
    global,
    render: h => h(App)
}).$mount('#app')
