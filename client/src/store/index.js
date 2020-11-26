import { createStore } from 'vuex'

import postModule from './modules/posts'

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
    posts: postModule
  }

})

export default store
