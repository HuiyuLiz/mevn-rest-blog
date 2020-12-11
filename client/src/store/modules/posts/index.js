import { getPosts, deletePost } from '@/api service/api.js'
export default {
  namespaced: true,
  state () {
    return {
      posts: [],
      totalPosts: 0,
      recentPosts: []
    }
  },
  getters: {
    posts (state) {
      return state.posts
    },
    recentPosts (state) {
      return state.recentPosts
    },
    totalPosts (state) {
      return state.totalPosts
    }
  },
  mutations: {
    setPosts (state, payload) {
      state.posts = payload
    },
    setRecentPosts (state, payload) {
      state.recentPosts = payload
    },
    setTotalPosts (state, payload) {
      state.totalPosts = payload
    },
    setErrorMessage (state, payload) {
      state.errorMessage = payload
    },
    setToken (state, payload) {
      state.token = payload
    }
  },
  actions: {
    async GET_POSTS ({ commit }, payload) {
      const response = new Promise((resolve, reject) => {
        getPosts(payload.page)
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              resolve(response)
            } else {
              throw new Error('Failed to fetch posts.')
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
      const result = await response
      const posts = result.data ? result.data.posts : []
      const totalPosts = result.data ? result.data.totalItem : 0
      if (payload.page === 1) {
        const recentPosts = posts.filter((post, index) => index < 3)
        commit('setRecentPosts', recentPosts)
      }
      commit('setPosts', posts)
      commit('setTotalPosts', totalPosts)
      return response
    },
    async DELETE_POST ({ commit, dispatch, getters }, payload) {
      const response = new Promise((resolve, reject) => {
        deletePost(payload.id, payload.token)
          .then((response) => {
            if (response.status === 200 || response.status === 201) {
              resolve(response)
            } else {
              throw new Error('Deleting a post failed.')
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
      const result = await response
      const posts = getters.posts.filter((post) => post._id !== payload.id)
      commit('setPosts', posts)
      return result
    }
  }
}
