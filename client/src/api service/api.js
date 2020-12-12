import axios from 'axios'

const api = `${process.env.VUE_APP_API_URL}/`

const apiRequest = axios.create({
  baseURL: api
})

// blog
export const getPosts = (page) => apiRequest.get('/blog/posts?page=' + page)
export const deletePost = (id, token) => apiRequest.delete(`/blog/posts/${id}`, token)
export const createPost = (data, token) => apiRequest.post('/blog/posts', data, token)
export const editingPost = (id, data, token) => apiRequest.put(`/blog/posts/${id}`, data, token)

// auth
export const signup = (data) => apiRequest.put('/auth/signup', data)
export const login = (data) => apiRequest.post('/auth/login', data)
