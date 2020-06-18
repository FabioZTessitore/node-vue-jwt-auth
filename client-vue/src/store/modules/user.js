import Vue from 'vue'
import router from '../../router';

const state = {
  status: '',
  token: '',
  user: {}
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
    state.user = {}
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
  },

  update_token: (state, token) => {
    state.token = token
  },

  update_user: (state, user) => {
    state.user = user
  }
};

const actions = {
  'refreshToken': ({ commit, dispatch }, expirationTime) => {
    setTimeout(() => {
      Vue.http.post('/refresh-token', { refreshToken: localStorage.getItem('refresh-token') })
        .then( response => response.json() )
        .then( data => {
          commit('update_token', data.token)
          dispatch('refreshToken', expirationTime)
        })
        .catch( () => {
          commit('auth_logout')
          router.replace('/login')
        })
    }, expirationTime * 1000)
  },

  'auth_request': ({ commit, dispatch }, { action, user }) => {
    return new Promise((resolve, reject) => {
      commit('auth_request')

      Vue.http.post(action, user)
      .then( response => response.json() )
      .then( data => {
        const token = data.token
        localStorage.setItem('user-token', token)
        localStorage.setItem('refresh-token', data.refreshToken)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + data.expiresIn*1000)
        localStorage.setItem('user-token-expirationDate', expirationDate)
        dispatch('refreshToken', data.expiresIn*.9)
        commit('update_token', token)
        dispatch('fetch-user')
      })
      .catch( err => {
        commit('auth_error')
        localStorage.removeItem('user-token')
        localStorage.removeItem('user-token-expirationDate')
        reject(err.body)
      })
    })
  },

  'auth_logout': ({ commit }) => {
      commit('auth_logout')
      localStorage.removeItem('user-token')
      localStorage.removeItem('user-token-expirationDate')
      localStorage.removeItem('refresh-token')
      router.replace('/login')
  },

  'tryLogin': ({ commit, dispatch }) => {
    const expirationTime = localStorage.getItem('user-token-expirationDate')
    const now = new Date()
    if (now >= expirationTime) {
      return
    }
    const token = localStorage.getItem('user-token')
    if (!token) {
      return
    }
    commit('update_token', token)
    dispatch('fetch-user')
  },

  'fetch-user': ({ commit }) => {
    Vue.http.get('/userdata')
        .then( response => response.json() )
        .then( data => {
          commit('update_user', data.user)
          router.replace('/dashboard')
        })
        .catch( () => {
          commit('auth_logout')
        })
  },

  'secure_data': () => {
    return new Promise((resolve) => {
      Vue.http.get('/secure-data')
        .then( response => response.json() )
        .then( data => {
          resolve(data)
        })
    })
  }
};

export default {
  state,
  getters,
  mutations,
  actions
};