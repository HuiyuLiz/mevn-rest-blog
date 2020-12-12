<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 mr-md-auto">
          <div class="section-title">
            <h2>Recent Notes</h2>
          </div>
          <!-- Toggle Modal Button-->
          <button
            type="button"
            class="btn btn-info mb-5 text-right"
            @click="toggleModal(false)"
          >
            Add New Post
          </button>
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
              <button
                class="btn btn-outline-secondary mt-3 px-3 py-2"
                @click.stop="getPost(post._id)"
              >
                Read More
              </button>
              <button
                class="btn btn-outline-success mx-2 mt-3 px-3 py-2"
                @click.stop="toggleModal(true, post)"
              >
                Editing
              </button>
              <button
                class="btn btn-outline-danger mt-3 px-3 py-2"
                @click.stop="deletePost(post._id)"
              >
                Delete
              </button>
            </PostItem>
          </template>
          <p class="h3 text-dark" v-else-if="!isLoading">No posts found.</p>
          <p class="h6 text-dark">{{ errorMessage }}</p>
        </div>
      </div>
      <BasePagination
        :name="routerName"
        :totalPosts="totalPosts"
      ></BasePagination>
      <!-- Modal -->
      <div
        ref="modal"
        class="modal fade"
        tabindex="-1"
        role="dialog"
        id="modal"
      >
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Title</h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
                @click="closeModal"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body bg-light">
              <div class="row">
                <div class="col-md-12 form-group">
                  <label for="title">Title</label>
                  <Form v-slot="{ errors }">
                    <Field
                      name="field"
                      as="input"
                      type="text"
                      :rules="isRequired"
                      class="form-control form-control-lg"
                      v-model.trim="editingPost.title"
                    />
                    <span class="text-danger">{{ errors.field }}</span>
                  </Form>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-md-12 form-group">
                  <div class="form-group">
                    <label>Image</label>
                    <div class="custom-file">
                      <label for="image" class="custom-label text-white"
                        >Upload</label
                      >
                      <input
                        type="file"
                        accept="image/jpg,image/jpeg,image/png"
                        class="form-control-file bg-white border py-2"
                        id="image"
                        style="border-radius: 30px"
                        ref="file"
                        name="imageUrl"
                        @change="onFileChange"
                      />
                    </div>
                    <span class="text-danger" v-if="!isUploaded"
                      >No image provided.</span
                    >
                  </div>
                </div>
                <div class="col-md-4 mx-auto">
                  <img :src="imagePreviewSrc" class="img-fluid" alt />
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 form-group">
                  <label for="content">Content</label>
                  <div class="editor">
                    <div class id="editorJs" />
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-outline-secondary"
                data-dismiss="modal"
                @click="closeModal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-secondary disabled"
                v-if="!isValidation"
              >
                unSave
              </button>
              <button
                type="button"
                class="btn btn-dark"
                v-else
                @click="createPost"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { createPost, editingPost } from '@/api service/api.js'
import PostItem from '@/components/Posts/PostItem.vue'
import BasePagination from '@/components/utilities/BasePagination.vue'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import LinkTool from '@editorjs/link'
import { Field, Form } from 'vee-validate'
import parseJson from 'parse-json'
export default {
  name: 'Posts',
  data () {
    return {
      isEditing: false,
      isUploaded: false,
      blocksLength: null,
      editingPost: {},
      editingImageUrl: '',
      imagePreviewSrc: '',
      editingBlocks: {},
      errorMessage: ''
    }
  },
  components: {
    PostItem,
    BasePagination,
    Field,
    Form
  },
  watch: {
    page (value) {
      if (this.$route.name !== 'Dashboard') return
      if (!value || value === undefined || value <= 0) {
        this.$router.push({ name: 'Dashboard', query: { page: 1 } })
      } else {
        this.getPosts(value)
      }
    },
    posts (value) {
      const page = this.page
      if (this.page <= 0) return
      if (this.posts.length <= 0 && this.page > 1) {
        this.$router.push({ name: 'Dashboard', query: { page: page - 1 } })
        this.getPosts(page - 1)
      }
    },
    token (newVal, oldVal) {
      if (!newVal || newVal !== oldVal) {
        this.$router.replace({ name: 'Auth' })
      }
    },
    errorMessage (value) {
      if (value !== '') {
        setTimeout(() => {
          this.errorMessage = ''
        }, 3000)
      }
    }
  },
  mounted () {
    this.componentDidMount()
    if (
      this.$route.fullPath === '/auth/posts' ||
      this.$route.fullPath === '/auth'
    ) {
      this.$router.push({ name: 'Dashboard', query: { page: 1 } })
      this.getPosts(1)
    } else {
      this.getPosts(this.page)
    }
    this.createEditor()
  },
  computed: {
    routerName () {
      return this.$route.name
    },
    token () {
      return this.$store.getters['auth/token']
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
    isLoading () {
      return this.$store.getters.isLoading
    },
    isValidation () {
      if (
        this.editingPost.title !== '' &&
        this.imagePreviewSrc !== '' &&
        this.blocksLength > 0
      ) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    componentDidMount () {
      if (!this.token) {
        this.$router.replace({ name: 'Auth' })
      }
    },
    toggleModal (isEditing, post) {
      this.$refs.file.value = ''
      this.editingImageUrl = ''
      this.isUploaded = true
      this.titleRequired = false
      if (!isEditing) {
        this.editingPost = {}
        this.isEditing = false
        this.imagePreviewSrc = ''
        this.clearContent()
      } else {
        this.editingPost = Object.assign({}, post)
        this.isEditing = true
        this.imagePreviewSrc =
          `${process.env.VUE_APP_API_URL}/` + this.editingPost.imageUrl
        const { content } = this.editingPost
        const editingContent = parseJson(content)
        const { blocks } = editingContent
        this.editingBlocks = { blocks }
        this.refreshContent(this.editingBlocks)
      }
      $('#modal').modal('show')
    },
    closeModal () {
      $('#modal').modal('hide')
    },
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
        console.log(error)
      }
      this.$store.commit('changeLoading', false)
    },
    async deletePost (id) {
      try {
        this.$store.dispatch('posts/DELETE_POST', {
          id: id,
          token: this.token
        })
      } catch (error) {
        if (error.response.status === 404) {
          this.errorMessage = 'Deleting a post failed.'
        } else {
          this.errorMessage = 'Something went wrong.'
        }
      }
    },
    responseHandler (response) {
      if (response.status === 200 || response.status === 201) {
        const updatePosts = [...this.posts]
        const updatePost = {
          _id: response.data.post._id,
          title: response.data.post.title,
          content: response.data.post.content,
          imageUrl: response.data.post.imageUrl,
          creator: response.data.creator,
          createdAt: response.data.post.createdAt
        }
        if (this.isEditing) {
          const index = this.posts.findIndex(
            (post) => post._id === updatePost._id
          )
          updatePosts[index] = updatePost
        } else {
          updatePosts.push(updatePost)
        }
        this.$store.commit('posts/setPosts', updatePosts)
      } else {
        throw new Error('Creating or editing a post failed.')
      }
    },
    errorHandler (error) {
      if (error) {
        this.errorMessage = 'Something went wrong.'
      }
    },
    async createPost () {
      const content = await window.editor.save()
      let newPost
      if (this.editingImageUrl === '' && this.isEditing) {
        newPost = {
          title: this.editingPost.title,
          content: content,
          imageUrl: this.editingPost.imageUrl
        }
      } else {
        newPost = {
          title: this.editingPost.title,
          content: content,
          imageUrl: this.editingImageUrl
        }
      }

      const formData = new FormData()
      formData.append('title', newPost.title)
      formData.append('content', JSON.stringify(newPost.content))
      formData.append('image', newPost.imageUrl)

      const config = {
        headers: {
          Authorization: 'Bearer ' + this.token
        }
      }
      if (!this.isEditing) {
        createPost(formData, config)
          .then((response) => {
            this.responseHandler(response)
            $('#modal').modal('hide')
          })
          .catch((error) => {
            this.errorHandler(error)
            $('#modal').modal('hide')
          })
      } else {
        editingPost(this.editingPost._id, formData, config)
          .then((response) => {
            this.responseHandler(response)
            $('#modal').modal('hide')
          })
          .catch((error) => {
            this.errorHandler(error)
            $('#modal').modal('hide')
          })
      }
    },
    async clearContent () {
      await window.editor.blocks.clear()
    },
    async refreshContent (data) {
      await window.editor.blocks.render(data)
    },
    createEditor () {
      const vm = this
      const data = vm.editingBlocks
      window.editor = new EditorJS({
        holder: 'editorJs',
        autofocus: true,
        initialBlock: 'paragraph',
        tools: {
          header: {
            class: Header,
            inlineToolbar: ['link']
          },
          list: {
            class: List,
            inlineToolbar: ['link', 'bold']
          },
          linkTool: {
            class: LinkTool
          },
          paragraph: {
            class: Paragraph,
            config: {
              placeholder: '.'
            }
          }
        },
        data: data,
        onReady: function () {
          window.editor.save().then((savedData) => {
            const { blocks } = savedData
            vm.blocksLength = blocks.length
          })
        },
        onChange: function () {
          window.editor.save().then((savedData) => {
            const { blocks } = savedData
            vm.blocksLength = blocks.length
          })
        }
      })
    },
    isRequired (value) {
      if (!value) {
        return 'This field is required'
      } else if (value && value.trim()) {
        return true
      }
    },
    async onFileChange (e) {
      const files = e.target.files || e.dataTransfer.files
      if (
        !files.length ||
        files[0].type === 'image/jpg' ||
        files[0].type === 'image/jpeg' ||
        files[0].type === 'image/png'
      ) {
        this.isUploaded = true
        this.editingImageUrl = files[0]
        try {
          const src = await this.loadFile(this.editingImageUrl)
          this.imagePreviewSrc = src
        } catch (error) {
          this.imagePreviewSrc = ''
          this.isUploaded = false
          console.log(error)
        }
      } else {
        this.isUploaded = false
      }
    },
    loadFile (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    }
  }
}
</script>

<style lang="css" scoped >
.editor {
  width: 100%;
  padding: 30px;
  border: 2px solid #f1f3f5;
  box-sizing: border-box;
  border-radius: 30px;
  overflow: hidden;
  background: white;
  border: 1px solid #ced4da;
}

.ce-block--focused {
  background: linear-gradient(
    90deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 0.5438550420168067) 35%,
    rgba(0, 212, 255, 1) 100%
  );
}
</style>
