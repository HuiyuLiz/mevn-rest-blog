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
              <a href="index.html" class="nav-logo text-dark h2">Tech notes.</a>
            <p>轉職前端工程師中，學習的一些紀錄。</p>
            </div>
            <a
              href="#"
              class="ml-auto d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black"
              ><span class="icon-menu h3"></span
            ></a>
          </div>
        </div>
      </div>

      <div
        class="site-navbar py-2 js-sticky-header site-navbar-target d-none pl-0 d-lg-block"
        role="banner"
      >
        <div class="container">
          <div class="d-flex align-items-center">
            <div class="mr-auto">
              <nav
                class="site-navigation position-relative text-right"
                role="navigation"
              >
                <ul
                  class="site-menu main-menu js-clone-nav mr-auto d-none pl-0 d-lg-block"
                >
                  <li class="active">
                    <router-link class="nav-link text-left" to="/"
                      >Home</router-link
                    >
                  </li>
                  <li>
                    <router-link class="nav-link text-left" to="/posts"
                      >Posts</router-link
                    >
                  </li>
                </ul>
              </nav>
            </div>
            <div class="search-form d-inline-block">
              <div class="d-flex">
                <button type="submit" class="btn btn-dark py-2 px-3">
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheHeader'
}
</script>

<style scoped>

</style>
