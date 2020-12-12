<template>
  <div class="pt-5 pb-5">
      <div class="container">
        <div class="row">
          <template v-if="post !== null">
            <SinglePostItem
            :title="post.title"
            :content="post.content"
            :image-url="post.imageUrl"
            :creator="post.creator"
            :createdAt="post.createdAt"
          ></SinglePostItem>
          </template>
          <p class="col h4" v-else>{{ errorMessage }}</p>
          <div class="col-lg-3 ml-auto">
            <div class="section-title">
              <h2>Popular Posts</h2>
            </div>
          <template v-if="recentPosts && recentPosts.length > 0">
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
      </div>
    </div>
</template>

<script>
import SinglePostItem from '@/components/SinglePost/SinglePostItem.vue'
import PostSummaryItem from '@/components/Posts/PostSummaryItem.vue'
export default {
  name: 'SinglePost',
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  components: {
    SinglePostItem,
    PostSummaryItem
  },
  data () {
    return {
      post: null,
      creator: null,
      errorMessage: ''
    }
  },
  watch: {
    $route (newRouter) {
      const newPostId = newRouter.params.postId
      this.getPost(newPostId)
    }
  },
  computed: {
    recentPosts () {
      return this.$store.getters['posts/recentPosts']
    }
  },
  methods: {
    getPost (postId) {
      this.$http({
        method: 'GET',
        url: `${process.env.VUE_APP_API_URL}/blog/posts/` + postId
      })
        .then((response) => {
          this.post = response.data ? response.data.post : null
          this.creator = response.data ? response.data.creator : null
        })
        .catch((error) => {
          this.post = null
          this.errorMessage = error.response.data.message
        })
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
  },
  mounted () {
    this.getPost(this.postId)
    this.getPosts(1)
  }
}
</script>

<style>
</style>
