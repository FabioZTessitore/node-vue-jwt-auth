<template>
    <div id="nav" class="nav">
        <div class="brand">Node Vue JWT</div>
        <div class="menu">
            <router-link tag="a" class="nav__link" to="/dashboard" v-if="isLoggedIn">Home</router-link>
            <router-link tag="a" class="nav__link" to="/" v-else>Home</router-link>
            <router-link tag="a" class="nav__link" to="#" @click="logout" v-if="isLoggedIn">Logout</router-link>
            <router-link tag="a" class="nav__link" to="/login" v-if="!isLoggedIn">Login</router-link>
            <router-link tag="a" class="nav__link" to="/signup" v-if="!isLoggedIn">Signup</router-link>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'isLoggedIn'
        ])
    },

    methods: {
        logout () {
            this.$store.dispatch('auth_logout')
            .then( () => this.$router.push('/') )
        }
    },
}
</script>