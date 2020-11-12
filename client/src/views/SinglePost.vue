<template>
  <div>
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
          <p class="col h4" v-else>{{ message }}</p>
          <div class="col-lg-3 ml-auto">
            <div class="section-title">
              <h2>Recent Posts</h2>
            </div>
            <PostSummaryItem></PostSummaryItem>
            <p>
              <a href="#" class="more"
                >See All Popular <span class="icon-keyboard_arrow_right"></span
              ></a>
            </p>
          </div>
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
      message: ''
    }
  },
  watch: {
    $route (newRouter) {
      const newPostId = newRouter.params.postId
      this.getPost(newPostId)
    }
  },
  methods: {
    getPost (postId) {
      this.$http
        .get(`${process.env.VUE_APP_API_URL}/blog/posts/` + postId)
        .then((response) => {
          this.post = response.data ? response.data.post : null
          console.log(this.post)
        })
        .catch((error) => {
          console.log(error)
          this.post = null
          this.message = error.response.data.message
        })
    }
  },
  mounted () {
    this.getPost(this.postId)
  }
}
</script>

<style>
</style>
