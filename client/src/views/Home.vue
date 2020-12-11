<template>
  <div class="pb-5">
    <Banner v-if="false"></Banner>
    <div
      id="carouselExampleIndicators"
      class="carousel slide mb-5"
      data-ride="carousel"
    >
      <ol class="carousel-indicators">
        <li
          data-target="#carouselExampleIndicators"
          data-slide-to="0"
          class="active"
        ></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active ">
          <div class="carousel-caption mb-5">
            <h3 class="text-decondary">MEVN PROJECT</h3>
            <p class="text-decondary">
              MongoDB + Express.js + Vue.js + Node.js
            </p>
          </div>
        </div>
      </div>
    </div>
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
          <p>
            <router-link
              class="more text-info d-flex align-items-center"
              :to="{ name: 'Posts' }"
              >See All Posts. <span class="icon-keyboard_arrow_right"></span
            ></router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PostItem from '@/components/Posts/PostItem.vue'
import PostSummaryItem from '@/components/Posts/PostSummaryItem.vue'
import Banner from '@/components/ui/Banner.vue'
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
    Banner
  },
  mounted () {
    this.getPosts(1)
  },
  computed: {
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
        await this.$store.dispatch('posts/GET_POSTS', { page: page })
      } catch (error) {
        this.errorMessage =
          error.response.data?.message || 'Something went wrong.'
        console.log(error)
      }
      this.$store.commit('changeLoading', false)
    }
  }
}
</script>
