<template>
  <div class="home">
    <h1>Home Page</h1>

    <app-sign-up></app-sign-up>
  </div>
</template>

<script>
import Signup from '@/components/Signup.vue'

export default {
  name: 'home',

  components: {
    appSignUp: Signup
  }
}
</script>
