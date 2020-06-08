<template>
    <div class="signup">

        <div class="u-center-text u-margin-bottom-big">
            <h1 class="heading-primary">Signup</h1>
        </div>

        <div class="signup-form">
            <form class="form" @submit.prevent="signup">
                <div class="form__group">
                    <input type="email" class="form__input" v-model="email" id="email" placeholder="Email" required>
                    <label for="email" class="form__label">Email</label>
                </div>

                <div class="form__group">
                    <input type="password" class="form__input" v-model="password" id="password" placeholder="Password" required>
                    <label for="password" class="form__label">Password</label>
                </div>

                <div class="form__group">
                    <input type="password" class="form__input" v-model="passwordAgain" id="passwordAgain" placeholder="Re-enter Password">
                    <label for="passwordAgain" class="form__label">Re-enter Password</label>
                </div>

                <div class="form__group" v-if="errorMatch">
                    <p class="form__error">Le password non coincidono</p>
                </div>

                <div class="form__group u-center-text">
                    <button class="btn btn--primary" type="submit">SignUp</button>
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
            passwordAgain: '',
        }
    },

    computed: {
        errorMatch () {
            return this.password && this.passwordAgain && this.password !== this.passwordAgain
        }
    },

    methods: {
        ...mapActions([
            'auth_request'
        ]),

        signup () {
            if (this.errorMatch) return

            this.auth_request({
                email: this.email,
                password: this.password
            }).then(() => this.$router.push('/dashboard') )
        }
    }
}
</script>