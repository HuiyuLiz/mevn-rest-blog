<template>
  <div>
    <div class="site-mobile-menu site-navbar-target">
      <div class="site-mobile-menu-header">
        <div class="site-mobile-menu-close mt-3">
          <span class="icon-close2 js-menu-toggle"></span>
        </div>
      </div>
      <div class="site-mobile-menu-body"></div>
    </div>
    <div class="header-top pb-2" style="border-bottom: 1px solid #efefef">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-6 d-flex align-items-center">
            <div class="d-flex flex-column">
              <a href="index.html" class="nav-logo text-dark h4">Tech notes.</a>
              <p class="text-secondary font-weight-bold">邁向前端工程師的練習筆記</p>
            </div>
            <a
              href="#"
              class="ml-auto d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black"
              @click="toggleMenu"
              ><span class="icon-menu h3"></span
            ></a>
          </div>
        </div>
      </div>

      <div
        class="site-navbar py-2 js-sticky-header site-navbar-target pl-0 d-lg-block"
        :class="toggleClass"
        role="banner"
      >
        <div class="container">
          <div class="d-block d-lg-flex align-items-center">
            <div class="mr-auto d-lg-block">
              <nav
                class="site-navigation position-relative text-right"
                role="navigation"
              >
                <ul
                  class="site-menu main-menu js-clone-nav mr-auto pl-0 d-block d-lg-none"
                >
                  <li class="w-100 text-center pl-1 pl-md-0 pb-5 pb-lg-0">
                    <router-link class="nav-link text-left" to="/"
                      >home</router-link
                    >
                  </li>
                  <li class="w-100 text-center pb-5 pb-lg-0">
                    <router-link
                      class="nav-link text-left"
                      :to="{
                        name: 'Posts',
                        query: {
                          page: 1,
                        },
                      }"
                      >Posts</router-link
                    >
                  </li>
                  <li class="active" v-if="isLoggedIn">
                    <router-link
                      class="nav-link text-left"
                      :to="{ name: 'Dashboard' }"
                      >dashboard</router-link
                    >
                  </li>
                </ul>
                <ul
                  class="site-menu main-menu js-clone-nav mr-auto pl-0 d-none d-lg-block"
                >
                  <li>
                    <router-link class="nav-link text-left" to="/"
                      >home</router-link
                    >
                  </li>
                  <li>
                    <router-link
                      class="nav-link text-left"
                      :to="{
                        name: 'Posts',
                        query: {
                          page: 1,
                        },
                      }"
                      >Posts</router-link
                    >
                  </li>
                  <li class="active" v-if="isLoggedIn">
                    <router-link
                      class="nav-link text-left"
                      :to="{ name: 'Dashboard' }"
                      >dashboard</router-link
                    >
                  </li>
                </ul>
              </nav>
            </div>
            <nav
              class="site-navigation position-relative text-center text-lg-right"
              role="navigation"
            >
              <ul
                class="site-menu main-menu js-clone-nav mr-auto pl-0 d-lg-block"
              >
                <li class="active">
                  <router-link to="/auth" class="btn btn-dark py-2 px-3" v-if="!isLoggedIn">
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
                <li class="pointer" @click="logout" v-if="isLoggedIn">
                  <a class="nav-link text-left">LOGOUT</a>
                </li>
              </ul>
            </nav>
            <!-- <div class="search-form">
              <ul class="d-flex">
                <router-link to="/auth" class="btn btn-dark py-2 px-3">
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
                <li class="pointer" @click="logout" v-if="isLoggedIn">
                  <a class="nav-link text-left">LOGOUT</a>
                </li>
                <li class="active">
                  <router-link class="nav-link text-left" to="/"
                    >home</router-link
                  >
                </li>
              </ul>
            </div> -->
          </div>
        </div>
      </div>
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
