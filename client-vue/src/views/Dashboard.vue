<template>
    <div class="dashboard">

        <div class="u-center-text u-margin-bottom-big">
            <h1 class="heading-primary">This page is protected</h1>
        </div>

        <div class="u-center-text u-margin-bottom-medium">
            <p class="user-info">You are {{ user }}</p>
        </div>

        <div class="u-center-text u-margin-bottom-small">
            <button class="btn btn--primary" @click="load">Click to load secure data</button>
        </div>

        <div class="u-center-text" v-if="counter">
            <p class="message">{{ message }}</p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data () {
        return {
            counter: ''
        }
    },

    computed: {
        ...mapGetters([
            'user'
        ]),

        message () {
            return 'Server counter is ' + this.counter
        }
    },

    methods: {
        ...mapActions([
            'secure_data'
        ]),

        load () {
            this.secure_data().then( data => {
                this.counter = data.counter
            })
        }
    }
}
</script>