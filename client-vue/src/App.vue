<template>
  <div id="app">
    <app-navigation-menu></app-navigation-menu>

    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import NavigationMenu from '@/components/NavigationMenu.vue'

export default {
  methods: {
    ...mapActions([
      'tryLogin'
    ])
  },

  created () {
    this.tryLogin()
  },

  components: {
    appNavigationMenu: NavigationMenu
  }
}
</script>
