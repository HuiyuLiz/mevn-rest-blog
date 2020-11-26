import axios from 'axios'

const api = `${process.env.VUE_APP_API_URL}/`

const apiRequest = axios.create({
  baseURL: api

})

export const getPosts = (page) => apiRequest.get('/blog/posts?page=' + page)
export const deletePost = (id) => apiRequest.delete(`/blog/posts/${id}`)
