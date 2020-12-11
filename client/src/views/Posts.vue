<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mr-md-auto">
          <div class="section-title">
            <h2>Recent Posts</h2>
          </div>
          <!-- Post Item -->
          <template v-if="posts && posts.length > 0 && !isLoading">
            <PostItem
              v-for="post in posts"
              class="row mb-5"
              :key="post._id"
              :title="post.title"
              :content="post.content"
              :image-url="post.imageUrl"
              :creator="post.creator"
              :createdAt="post.createdAt"
              :id="post._id"
              @get-post="getPost"
            >
              <div class="text-info pointer" @click.stop="getPost(post._id)">
                Read More
              </div>
            </PostItem>
          </template>
          <p class="h3 text-dark" v-else-if="!isLoading">No posts found.</p>
          <p class="h6 text-dark">{{ errorMessage }}</p>
        </div>
        <!-- Post Summary Item -->
        <div class="col-lg-3 mt-5 mt-lg-0">
          <div class="section-title">
            <h2>Popular Posts</h2>
          </div>
          <template v-if="recentPosts && recentPosts.length > 0 && !isLoading">
            <PostSummaryItem
              v-for="(post, index) in recentPosts"
              :index="index"
              :key="post._id"
              :title="post.title"
              :creator="post.creator"
              :id="post._id"
              :createdAt="post.createdAt"
            >
            </PostSummaryItem>
          </template>
        </div>
      </div>
      <BasePagination
        :name="routerName"
        :totalPosts="totalPosts"
      ></BasePagination>
    </div>
  </div>
</template>

<script>
import PostItem from '@/components/Posts/PostItem.vue'
import PostSummaryItem from '@/components/Posts/PostSummaryItem.vue'
import BasePagination from '@/components/utilities/BasePagination.vue'
export default {
  name: 'Posts',
  data () {
    return {
      errorMessage: ''
    }
  },
  components: {
    PostItem,
    PostSummaryItem,
    BasePagination
  },
  watch: {
    page (value) {
      if (this.$route.name !== 'Posts') return
      if (!value || value === undefined || value <= 0) {
        this.$router.push({ name: 'Posts', query: { page: 1 } })
      } else {
        this.getPosts(value)
      }
    },
    posts (value) {
      const page = this.page
      if (this.page <= 0) return
      if (this.posts.length <= 0 && this.page > 1) {
        this.$router.push({ name: 'Posts', query: { page: page - 1 } })
        this.getPosts(page - 1)
      }
    }
  },
  mounted () {
    if (
      this.$route.fullPath === '/posts/' ||
      this.$route.fullPath === '/posts'
    ) {
      this.$router.push({ name: 'Posts', query: { page: 1 } })
      this.getPosts(1)
    } else {
      this.getPosts(this.page)
    }
  },
  computed: {
    routerName () {
      return this.$route.name
    },
    totalPosts () {
      return this.$store.getters['posts/totalPosts']
    },
    page () {
      return this.$route.query.page
    },
    posts () {
      return this.$store.getters['posts/posts']
    },
    recentPosts () {
      return this.$store.getters['posts/recentPosts']
    },
    isLoading () {
      return this.$store.getters.isLoading
    }
  },
  methods: {
    getPost (postId) {
      this.$router.push({ name: 'SinglePost', params: { postId: postId } })
    },
    async getPosts (page = 1) {
      this.$store.commit('changeLoading', true)
      try {
        await this.$store.dispatch('posts/GET_POSTS', {
          page: page
        })
      } catch (error) {
        this.errorMessage =
          error.response.data?.message || 'Something went wrong.'
      }
      this.$store.commit('changeLoading', false)
    }
  }
}
</script>
