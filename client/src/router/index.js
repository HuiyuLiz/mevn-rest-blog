import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "posts" */ '../views/Login.vue')
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import(/* webpackChunkName: "posts" */ '../views/Posts.vue')
  }, {
    path: '/posts/:postId',
    name: 'SinglePost',
    component: () => import(/* webpackChunkName: "SinglePost" */ '../views/SinglePost.vue'),
    props: (route) => {
      return {
        postId: route.params.postId
      }
    }

  }, {
    path: '/:notFounded(.*)', redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
