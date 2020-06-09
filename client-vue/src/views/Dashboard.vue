<template>
    <div>
        <h1>This page is protected by auth</h1>

        <p>You are {{ foo }}</p>

        <button @click="load">Click to load secure data</button>
        <p>{{ msg }}</p>
        <p>{{ counter }}</p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

// import axios from 'axios'

export default {
    data () {
        return {
            msg: '',
            counter: 0
        }
    },

    computed: {
        ...mapGetters({
            foo: 'user'
        })
    },

    methods: {
        load () {
            return new Promise( (resolve) => {
                resolve()
                /*axios({
                    url: '/secure-data',
                    method: 'GET'
                }).then( (resp) => {
                    console.log(resp.data)
                    this.msg = resp.data.message
                    this.counter = resp.data.counter
                    resolve(resp)
                }).catch( (err) => {
                    console.log('catch', err)
                })*/
            })
        }
    },

    created () {
        console.log(this.foo)
    }
}
</script>