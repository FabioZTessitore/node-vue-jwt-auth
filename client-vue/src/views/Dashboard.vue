<template>
    <div class="dashboard">
        <h1 class="heading-primary">This page is protected by auth</h1>

        <p>You are {{ user }}</p>

        <button @click="load">Click to load secure data</button>

        <p>Message: {{ msg }}</p>
        <p>Counter: {{ counter }}</p>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    data () {
        return {
            msg: '',
            counter: 0
        }
    },

    computed: {
        ...mapGetters([
            'user'
        ])
    },

    methods: {
        ...mapActions([
            'secure_data'
        ]),

        load () {
            this.secure_data().then(data => {
                this.msg = data.message
                this.counter = data.counter
            })
        }
    }
}
</script>