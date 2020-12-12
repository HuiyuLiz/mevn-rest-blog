<template>
  <div class="container-fluid" style="border-bottom: 1px solid #efefef">
    <div class="container">
      <nav
        class="navbar navbar-expand-sm navbar-light bg-none flex-column align-items-stretch px-0 pt-5"
      >
        <div class="d-flex mb-3">
          <div class="mr-auto">
            <a href="index.html" class="nav-logo text-dark h4">Tech notes.</a>
            <p class="text-secondary font-weight-bold mt-2">
              邁向前端工程師的練習筆記
            </p>
          </div>
          <button
            class="navbar-toggler border-none"
            data-toggle="collapse"
            data-target="#navbarMenu"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div>
          <div class="collapse navbar-collapse w-100 sticky-top mb-2" id="navbarMenu">
          <ul class="navbar-nav">
            <li class="nav-item">
              <router-link class="nav-link text-uppercase pl-0" to="/"
                >home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-uppercase"
                :to="{
                  name: 'Posts',
                  query: {
                    page: 1,
                  },
                }"
                >Posts</router-link
              >
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link
                class="nav-link text-uppercase"
                :to="{ name: 'Dashboard' }"
                >dashboard</router-link
              >
            </li>
          </ul>
          <ul class="navbar-nav ml-auto">
            <li>
              <router-link
                to="/auth"
                class="btn btn-dark py-2 px-3"
                v-if="!isLoggedIn"
              >
                <span class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    width="20px"
                    height="20px"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    /></svg
                ></span>
              </router-link>
            </li>
            <li class="nav-item pointer" @click="logout" v-if="isLoggedIn">
              <a class="nav-link text-uppercase">LOGOUT</a>
            </li>
          </ul>
        </div>
        </div>

      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheHeader',
  computed: {
    isLoggedIn () {
      return this.$store.getters['auth/isAuthenticated']
    },
    toggleClass () {
      return this.isToggle ? 'd-block' : 'd-none'
    }
  },
  data () {
    return {
      isToggle: false
    }
  },
  methods: {
    toggleMenu () {
      this.isToggle = !this.isToggle
    },
    logout () {
      this.$store.dispatch('auth/LOGOUT')
      this.$router.replace({ name: 'Auth' })
    }
  }
}
</script>

<style scoped>
</style>
