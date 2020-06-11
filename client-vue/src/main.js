import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App.vue'
import router from './router'
import store from './store/store'

Vue.use(VueResource);

Vue.config.productionTip = false

Vue.http.interceptors.push((request, next) => {
  request.headers.set('Authorization', store.state.user.token)
  next()
})
 
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
