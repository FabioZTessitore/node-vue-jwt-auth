import Vue from 'vue'

const store = {
  status: '',
  token: localStorage.getItem('user-token') || '',
  userData: {}
};

const getters = {
  isLoggedIn: state => !!state.token,
  authStatus: state => state.status,
  user: state => state.user
};

const mutations = {
  auth_request: (state) => {
    state.status = 'loading'
    state.token = ''
    state.userData = {}
  },

  auth_success: (state, { token, user }) => {
    state.status = 'success'
    state.token = token
    state.userData = user
  },

  auth_error: (state) => {
    state.status = 'error'
    state.token = ''
    state.userData = {}
  },

  auth_logout: (state) => {
    state.status = ''
    state.token = ''
    state.userData = {}
  }
};

const actions = {
  'auth_request': ({ commit }, { action, user }) => {
    return new Promise((resolve, reject) => {
      commit('auth_request')

      console.log(action, user)
      
      Vue.http.post(action, user)
      .then(response => {
        console.log('response', response)
        return response.json()
      })
      .then(data => {
        console.log('json response', data)
        commit('auth_success', { token: data.token, user: data.user })
        localStorage.setItem('user-token', data.token)
        resolve('ok')
      })
      .catch( err => {
        commit('auth_error')
        localStorage.removeItem('user-token')
        reject(err.body)
      })
    })
  },

  'auth_logout': ({ commit }) => {
    return new Promise((resolve) => {
      commit('auth_logout')
      localStorage.removeItem('user-token')
      resolve('ok')
    })
  }
};

export default {
  store,
  getters,
  mutations,
  actions
};