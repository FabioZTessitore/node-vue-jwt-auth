<template>
  <div id="app">
    <div id="nav">
      <router-link to="/dashboard" v-if="isLoggedIn">Home</router-link>
      <router-link to="/" v-else>Home</router-link>
      <span v-if="isLoggedIn"> | <a @click="logout">Logout</a></span>
      <span v-else> | <a @click="login">Login</a></span>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  computed: {
    isLoggedIn () {
      return  this.$store.getters.isLoggedIn
    }
  },

  methods: {
    login () {
      this.$router.push('/login')
    },

    logout () {
      this.$store.dispatch('auth_logout')
        .then( () => this.$router.push('/') )
    }
  },

  created () {
    axios.interceptors.response.use(undefined, (err) => {
      const res = err.response
      return new Promise((resolve, reject) => {
        if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
          console.log('logout please')
          this.$store.dispatch('auth_logout')
          this.$router.push('/')
        }

        throw err
      })
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
