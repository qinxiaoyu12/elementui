import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import home from "@/components/home";
import User from "@/components/user/User";
import Welcome from "../components/Welcome";
import Rights from "@/components/power/Rights";
import Roles from "@/components/power/Roles";
import Cate from "@/components/goods/Cate";

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
               { path: '/categories', component: Cate}
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
