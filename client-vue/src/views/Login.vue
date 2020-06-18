<template>
    <div class="login">

        <div class="u-center-text u-margin-bottom-big">
            <h1 class="heading-primary">Login</h1>
        </div>

        <div class="login-form">
            <form class="form" @submit.prevent="login">
                <div class="form__group">
                    <input type="email" class="form__input" v-model="email" id="email" placeholder="Email" required>
                    <label for="email" class="form__label">Email</label>
                </div>

                <div class="form__group">
                    <input type="password" class="form__input" v-model="password" id="password" placeholder="Password" required>
                    <label for="password" class="form__label">Password</label>
                </div>

                <div class="form__group" v-if="error">
                    <p class="form__error">{{ error }}</p>
                </div>

                <div class="form__group u-center-text">
                    <button class="btn btn--primary" type="submit">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    data () {
        return {
            email: '',
            password: '',
            error: ''
        }
    },

    methods: {
        ...mapActions([
            'auth_request'
        ]),

        login () {
            this.auth_request({ action: '/login', user: {
                email: this.email,
                password: this.password
            }})
            .then( () => {
                this.$router.push('/dashboard')
            })
            .catch( err => {
                this.error = err.msg
            })
        }
    }
}
</script>