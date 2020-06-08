<template>
  <div id="app">
    <app-navigation-menu></app-navigation-menu>

    <router-view/>
  </div>
</template>

<script>
import NavigationMenu from '@/components/NavigationMenu.vue'

export default {
  created () {
    /*axios.interceptors.response.use(undefined, (err) => {
      const res = err.response
      return new Promise(() => {
        if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
          console.log('logout please')
          this.$store.dispatch('auth_logout')
          this.$router.push('/')
        }

        throw err
      })
    })*/
  },

  components: {
    appNavigationMenu: NavigationMenu
  }
}
</script>
