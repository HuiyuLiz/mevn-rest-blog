import { createStore } from 'vuex'

import postModule from './modules/posts'
import authModule from './modules/auth'

const store = createStore({
  state () {
    return {
      isLoading: false
    }
  },
  getters: {
    isLoading (state) {
      return state.isLoading
    }
  },
  mutations: {
    changeLoading (state, payload) {
      state.isLoading = payload
    }
  },
  modules: {
    posts: postModule,
    auth: authModule
  }

})

export default store
