import { getPosts, deletePost } from '@/api service/api.js'
export default {
  namespaced: true,
  state () {
    return {
      posts: [],
      totalPosts: 0
    }
  },
  getters: {
    posts (state) {
      return state.posts
    },
    totalPosts (state) {
      return state.totalPosts
    }
  },
  mutations: {
    setPosts (state, payload) {
      state.posts = payload
    },
    setTotalPosts (state, payload) {
      state.totalPosts = payload
    },
    setErrorMessage (state, payload) {
      state.errorMessage = payload
    }
  },
  actions: {
    async GET_POSTS ({ commit, dispatch }, page) {
      console.log('page', page)
      const response = new Promise((resolve, reject) => {
        getPosts(page)
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
      console.log(result)
      const posts = result.data ? result.data.posts : []
      const totalPosts = result.data ? result.data.totalItem : 0
      commit('setPosts', posts)
      commit('setTotalPosts', totalPosts)
      return response
    },
    async DELETE_POST ({ commit, dispatch, getters }, id) {
      const response = new Promise((resolve, reject) => {
        deletePost(id)
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
      const posts = getters.posts.filter((post) => post._id !== id)
      commit('setPosts', posts)
      return result
      // axios
      //   .delete(`${process.env.VUE_APP_API_URL}/blog/posts/${id}`)
      //   .then((response) => {
      //     if (response.status !== 200) {
      //       throw new Error('Deleting a post failed.')
      //     }
      //     const posts = getters.posts.filter((post) => post._id !== id)
      //     commit('setPosts', posts)
      //   })
      //   .catch((error) => {
      //     console.log('error', error)
      //   })
    }

  }
}
