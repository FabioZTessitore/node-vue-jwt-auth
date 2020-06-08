import Vue from 'vue'

const store = {
    status: '',
    token: localStorage.getItem('user-token') || '',
    user: {}
};

const getters = {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user
};

const mutuations = {
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
    }
};

const actions = {
    'auth_request': ({ commit }, user) => {
        return new Promise((resolve, reject) => {
          commit('auth_request')

          console.log('/signup', user)
          
          Vue.http.get('/signup', user)
          .then(response => {
            return response.json()
          })
          .then(data => {
            console.log('signup response', data)
            commit('auth_success', { token: 1, user: '' })
          })
          resolve() || reject()
          /*axios({
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
          })*/
        })
    },
  
    'auth_logout': ({ commit }) => {
        return new Promise((resolve) => {
          commit('auth_logout')
          localStorage.removeItem('user-token')
          resolve()
        })
    }
};

export default {
    store,
    getters,
    mutuations,
    actions
};