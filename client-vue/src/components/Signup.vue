<template>
    <div class="signup">
        <form @submit.prevent="signup">
            <label>Name:
                <input type="text" v-model="name">
            </label>

            <br>

            <label>Email:
                <input type="email" v-model="email">
            </label>

            <br>

            <label>Password:
                <input type="password" v-model="password">
            </label>

            <br>

            <label>Password Confirm:
                <input type="password" v-model="passwordConfirm">
            </label>

            <hr>

            <button type="submit">SignUp</button>
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
            password: '',
            passwordConfirm: ''
        }
    },

    methods: {
        ...mapActions([
            'auth_request'
        ]),

        signup () {
            if (!this.name || !this.email || !this.password || !this.passwordConfirm) return
            if (this.passwordConfirm !== this.password) return

            this.auth_request({ action: '/register', user: {
                name: this.name,
                email: this.email,
                password: this.password
            }}).then(() => this.$router.push('/dashboard') )
        }
    }
}
</script>