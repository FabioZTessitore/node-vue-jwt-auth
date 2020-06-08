import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import store from './store/store'

Vue.use(VueResource);

Vue.config.productionTip = false

const token = localStorage.getItem('user-token')
if (token) {
  //axios.defaults.headers.common['Authorization'] = token
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
