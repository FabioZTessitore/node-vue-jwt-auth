import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('user-token') || '',
    user: {}
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user
  },
  mutations: {
    auth_request: (state) => {
      state.status = 'loading'
    },

    auth_success: (state, { token, user }) => {
      state.status = 'success'
      state.token = token
      state.user = user
    },

    auth_error: (state) => {
      state.status = 'error'
      state.token = ''
      state.user = {}
    },

    auth_logout: (state) => {
      state.status = ''
      state.token = ''
      state.user = {}
    }
  },
  actions: {
    'auth_request': ({ commit }, { action, user }) => {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({
          url: action,
          data: user,
          method: 'POST'
        }).then( (resp) => {
          const token = resp.data.token
          localStorage.setItem('user-token', token)
          const user = resp.data.user
          commit('auth_success', { token, user })
          axios.defaults.headers.common['Authorization'] = token
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error', err)
          localStorage.removeItem('user-token')
          reject(err)
        })
      })
    },

    'auth_logout': ({ commit }) => {
      return new Promise((resolve) => {
        commit('auth_logout')
        localStorage.removeItem('user-token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  }
})
