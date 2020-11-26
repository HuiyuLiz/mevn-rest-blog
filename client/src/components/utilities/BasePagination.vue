<template>
  <div class="row">
    <div class="col-lg-6">
     totalPosts {{ totalPosts }} totalPage{{ totalPage}} currentPage:{{currentPage}}
      <ul class="custom-pagination list-unstyled">
        <li v-for="page in totalPage" :key="page" class="px-2 text-secondary" :class="{'active':currentPage===page}">
          <router-link :to="{ name:'Posts',query: { page: page}}">{{ page }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    totalPosts: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      perPageItem: 5
    }
  },
  mounted () {
    console.log(this.currentPage, this.totalPosts / this.perPageItem)
  },
  computed: {
    currentPage () {
      return parseInt(this.$route.query.page)
    },
    totalPage () {
      return Math.ceil(this.totalPosts / this.perPageItem)
    }
  }
}
</script>

<style>
</style>
