<template>
  <div class="row">
    <div class="col-lg-6">
      <ul class="custom-pagination list-unstyled">
        <li v-for="page in totalPage" :key="page" class="mr-2 text-secondary" :class="{'active':currentPage===page}">
          <router-link :to="{ name:name,query: { page: page}}">{{ page }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasePagination',
  props: {
    name: {
      type: String
    },
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
