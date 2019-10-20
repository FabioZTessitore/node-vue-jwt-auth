<template>
    <div>
        <form @submit.prevent="login">
            <label>Name:
                <input type="text" v-model="name">
            </label>

            <label>Email:
                <input type="email" v-model="email">
            </label>

            <label>Password:
                <input type="password" v-model="password">
            </label>

            <hr>

            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            name: '',
            email: '',
            password: ''
        }
    },

    methods: {
        ...mapActions([
            'auth_request'
        ]),

        login: function () {
            if (!this.name || !this.email || !this.password) return

            this.auth_request({ action: '/login', user: {
                name: this.name,
                email: this.email,
                password: this.password
            }}).then( () => this.$router.push('/dashboard') )
        }
    }
}
</script>