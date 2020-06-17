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
  }
};

const actions = {
  'refreshToken': ({ commit, dispatch }, expirationTime) => {
    setTimeout(() => {
      console.log(new Date(), 'request new token')
      Vue.http.post('/refresh-token', { refreshToken: localStorage.getItem('refresh-token') })
        .then(response => {
          return response.json()
        })
        .then(data => {
          commit('update_token', data.token)
          console.log('new token is ', data.token)
          console.log('new token request in ', expirationTime*1000)
          dispatch('refreshToken', expirationTime)
        })
        .catch((err) => {
          console.log(err)
          commit('auth_logout')
          router.replace('/login')
        })
    }, expirationTime * 1000)
  },

  'auth_request': ({ commit, dispatch }, { action, user }) => {
    return new Promise((resolve, reject) => {
      commit('auth_request')

      console.log(action, user)
      
      Vue.http.post(action, user)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log('json response', data)
        commit('auth_success', { token: data.token, user: data.user })
        dispatch('refreshToken', data.expiresIn*.9)
        console.log('new token request in ', data.expiresIn*1000*.9)
        localStorage.setItem('user-token', data.token)
        localStorage.setItem('refresh-token', data.refreshToken)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + data.expiresIn*1000)
        localStorage.setItem('user-token-expirationDate', expirationDate)
        resolve('ok')
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

  'tryLogin': ({ commit }) => {
    console.log('trylogin')
    const expirationTime = localStorage.getItem('user-token-expirationDate')
    const now = new Date()
    if (now >= expirationTime) {
      return
    }
    const token = localStorage.getItem('user-token')
    console.log(token)
    if (!token) {
      return
    }
    commit('auth_success', {
      token: token,
      user: {}
    })

    
    Vue.http.get('/userdata')
      .then(response => {
        console.log('response', response)
        return response.json()
      })
      .then(data => {
        console.log('json response', data)
        commit('auth_success', {
          token: token,
          user: data.user
        })
        router.replace('/dashboard')
      })
      .catch( () => {
        commit('auth_logout')
      })
  },

  'secure_data': () => {
    return new Promise((resolve) => {
      console.log('loading secure data')

      Vue.http.get('/secure-data')
        .then(response => {
          console.log('response', response)
          return response.json()
        })
        .then(data => {
          console.log('json response', data)
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