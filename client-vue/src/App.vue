<template>
  <div id="app">
    <app-navigation-menu></app-navigation-menu>

    <router-view/>
  </div>
</template>

<script>
import NavigationMenu from '@/components/NavigationMenu.vue'

export default {
  components: {
    appNavigationMenu: NavigationMenu
  }
}
</script>
