import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Signup from './components/Signup.vue'
import Secure from './components/Secure.vue'
import Login from './components/Login.vue'

import store from './store'

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isLoggedIn) {
    next()
    return
  }

  next('/')
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Signup
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Secure,
      beforeEnter: ifAuthenticated
    }
  ]
})
