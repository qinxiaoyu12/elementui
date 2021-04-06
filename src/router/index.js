import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import home from "@/components/home";
<<<<<<< HEAD
import Welcome from "@/components/Welcome";
import User from "@/components/user/User";
=======
import Welcome from "../components/Welcome";
>>>>>>> 013d0ba184e61a62926cc5ce489166a228a5cc99

Vue.use(VueRouter)

const routes = [
  {path: '/', redirect:'/login'},
  {path:'/login', component:Login},
  { path: '/home',
    component: home,
    redirect: '/welcome',
<<<<<<< HEAD
    children: [{ path:'/welcome', component:Welcome },
               { path: '/users', component: User}
    ]
  },

=======
    children: [{
      path:'/welcome',
      component: Welcome
    }
  ]
  }
>>>>>>> 013d0ba184e61a62926cc5ce489166a228a5cc99
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
