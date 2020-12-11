import { signup, login } from '@/api service/api.js'
let timer
export default {
  namespaced: true,
  state () {
    return {
      message: '',
      token: '',
      userId: '',
      timer
    }
  },
  getters: {
    message (state) {
      return state.message
    },
    token (state) {
      return state.token
    },
    userId (state) {
      return state.userId
    },
    isAuthenticated (state) {
      return !!state.token
    }

  },
  mutations: {
    setMessage (state, payload) {
      state.message = payload
    },
    setUser (state, { token, userId }) {
      state.token = token
      state.userId = userId
    }
  },
  actions: {
    async SIGNUP ({ commit }, payload) {
      const response = new Promise((resolve, reject) => {
        signup(payload)
          .then((response) => {
            if (response.status === 422) {
              throw new Error('Validation failed.')
            }
            if (response.status === 200 || response.status === 201) {
              resolve(response)
            } else {
              throw new Error('Creating a user failed.')
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
      const result = await response
      const message = result.data ? result.data.message : ''
      commit('setMessage', message)
      return response
    },
    async LOGIN ({ commit, dispatch }, payload) {
      const response = new Promise((resolve, reject) => {
        login(payload)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
      const result = await response
      const data = result?.data || {}
      const message = result.data ? result.data.message : ''
      commit('setMessage', message)
      commit('setUser', data)
      dispatch('SET_LOCAL_STORAGE')
      return response
    },
    AUTO_LOGIN ({ commit, dispatch }) {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')
      const tokenExpiration = localStorage.getItem('tokenExpiration')

      const expiresIn = +tokenExpiration - new Date().getTime()

      if (expiresIn < 0) return

      timer = setTimeout(() => {
        dispatch('LOGOUT')
      }, expiresIn)

      if (token && userId) {
        const data = { token, userId }
        commit('setUser', data)
      }
      console.log('AUTO_LOGIN')
    },
    SET_LOCAL_STORAGE ({ getters, dispatch }) {
      const expiresIn = 60 * 60 * 1000
      const expiresDate = new Date().getTime() + expiresIn
      console.log('SET_LOCAL_STORAGE')
      localStorage.setItem('token', getters.token)
      localStorage.setItem('userId', getters.userId)
      localStorage.setItem('tokenExpiration', expiresDate)

      timer = setTimeout(() => {
        dispatch('LOGOUT')
      }, expiresIn)
    },
    REMOVE_LOCAL_STORAGE () {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('tokenExpiration')
    },
    LOGOUT ({ commit, dispatch }) {
      console.log('LOGOUT')
      const data = {
        token: null,
        userId: null
      }
      commit('setUser', data)
      dispatch('REMOVE_LOCAL_STORAGE')

      clearTimeout(timer)
    }
  }
}
