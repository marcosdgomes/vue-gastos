import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {
      icon: 'home', title: 'Home'
    },
    component: () => import('../pages/Home/Home')
  },
  {
    path: '/expenses-list',
    name: 'ExpensesList',
    meta: {
      icon: 'list-ul', title: 'Lista de Gastos'
    },
    component: () => import('../pages/Expenses/ExpensesList')
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login'
    },
    component: () => import('../pages/Login/Login')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,from,next)=>{

  document.title = `${to.meta.title} - Expenses`

  if(!window.uid && to.name !== 'Login'){
    next({name: 'Login'})
  }
  else{
    next()
  }
})//verificando a rota que o usuário está e permitindo acesso ou não

export default router
