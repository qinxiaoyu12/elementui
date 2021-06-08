import Vue from 'vue'
import VueRouter from 'vue-router'
//路由懒加载
const Login = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Login.vue')
const home = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName:"Login_Home_Welcome" */ '../components/Welcome.vue')

const User = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../components/user/User.vue')
const Rights = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"User_Rights_Roles" */ '../components/power/Roles.vue')

const Cate = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName:"Cate_Params" */ '../components/goods/Params.vue')

const Goods = () => import(/* webpackChunkName:"Goods_AddGoods" */ '../components/goods/Goods.vue')
const AddGoods = () => import(/* webpackChunkName:"Goods_AddGoods" */ '../components/goods/AddGoods.vue')

const Order = () => import(/* webpackChunkName:"Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName:"Order_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect:'/login'},
  {path:'/login', component:Login},
  { path: '/home',
    component: home,
    redirect: '/welcome',
    children: [{ path:'/welcome', component:Welcome },
               { path: '/users', component: User},
               { path: '/rights', component: Rights},
               { path: '/roles', component: Roles},
               { path: '/categories', component: Cate},
               { path: '/params', component: Params},
               { path: '/goods', component: Goods},
               { path: '/goods/add', component: AddGoods },
               { path: '/orders', component: Order},
               { path: '/reports', component: Report}
    ]
  },
]

const router = new VueRouter({
  routes
})

//挂载导航路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();
})
export default router
