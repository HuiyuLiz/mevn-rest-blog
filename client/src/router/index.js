import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import(/* webpackChunkName: "Auth" */ '../views/Auth.vue'),
    meta: { requiresUnAuth: true }
  },
  {
    path: '/auth/posts',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/posts',
    name: 'Posts',
    component: () => import(/* webpackChunkName: "Posts" */ '../views/Posts.vue')
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next({ name: 'Auth' })
  } else if (to.meta.requiresUnAuth && store.getters['auth/isAuthenticated']) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
