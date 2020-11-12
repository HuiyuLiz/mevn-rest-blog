<template>
  <div class="pt-5 pb-5">
    <div class="container">
      <div class="row">
        <div class="col-lg-8 mr-md-auto">
          <div class="section-title">
            <span class="caption d-block small">Categories</span>
            <h2>Tech</h2>
          </div>
          <!-- Toggle Modal Button-->
          <button
            type="button"
            class="btn btn-info mb-3"
            @click="toggleModal(false)"
          >
            Add New Post
          </button>
          <!-- Post Item -->
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
            @editing-post="toggleModal(true, post)"
            @delete-post="deletePost"
          >
          </PostItem>
        </div>
        <!-- Post Summary Item -->
        <div class="col-lg-3 mt-5 mt-lg-0">
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
      <BasePagination></BasePagination>
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
                    <span class="text-danger" v-if="!isUploaded && !isEditing"
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
import PostItem from '@/components/Posts/PostItem.vue'
import PostSummaryItem from '@/components/Posts/PostSummaryItem.vue'
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
      posts: [],
      isEditing: false,
      isUploaded: false,
      blocksLength: null,
      editingPost: {},
      editingTitle: '',
      editingImageUrl: '',
      editingBlocks: {},
      imagePreviewSrc: ''
    }
  },
  components: {
    PostItem,
    PostSummaryItem,
    BasePagination,
    Field,
    Form
  },
  mounted () {
    this.getPosts()
    this.createEditor()
  },
  computed: {
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
    toggleModal (isEditing, post) {
      this.$refs.file.value = ''
      this.editingImageUrl = ''
      console.log('toggleModal', this.$refs.file.value)
      if (!isEditing) {
        this.editingPost = {}
        this.isEditing = false
        this.imagePreviewSrc = ''
        this.clearContent()
      } else {
        this.editingPost = Object.assign({}, post)
        this.isEditing = true
        this.imagePreviewSrc = `${process.env.VUE_APP_API_URL}/` + this.editingPost.imageUrl
        const { content } = this.editingPost
        const editingContent = parseJson(content)
        const { blocks } = editingContent
        this.editingBlocks = { blocks }
        this.refreshContent(this.editingBlocks)

        console.log()
      }
      $('#modal').modal('show')
    },
    closeModal () {
      $('#modal').modal('hide')
    },
    getPost (postId) {
      this.$router.push({ name: 'SinglePost', params: { postId: postId } })
    },
    getPosts () {
      this.$http
        .get(`${process.env.VUE_APP_API_URL}/blog/posts`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Failed to fetch posts.')
          }
          this.posts = response.data ? response.data.posts : []
          console.log(this.posts)
        })
        .catch((error) => {
          console.log('error', error)
        })
    },
    deletePost (id) {
      this.$http
        .delete(`${process.env.VUE_APP_API_URL}/blog/posts/${id}`)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Deleting a post failed.')
          }
          this.posts = this.posts.filter(post => post._id !== id)
        })
        .catch((error) => {
          console.log('error', error)
        })
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
      let method
      let url
      if (!this.isEditing) {
        method = 'POST'
        url = `${process.env.VUE_APP_API_URL}/blog/posts`
      } else {
        method = 'PUT'
        url = `${process.env.VUE_APP_API_URL}/blog/posts/${this.editingPost._id}`
      }

      const formData = new FormData()
      formData.append('title', newPost.title)
      formData.append('content', JSON.stringify(newPost.content))
      formData.append('image', newPost.imageUrl)
      console.log('newPost', newPost)
      this.$http({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response) => {
          if (response.status !== 200 && response.status !== 201) {
            throw new Error('Creating or editing a post failed.')
          }
          this.getPosts()
          $('#modal').modal('hide')
        })
        .catch((error) => {
          console.log('error', error.response.data.message)
          $('#modal').modal('hide')
        })
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
            console.log(
              'onReady', data,
              vm.editingBlocks
            )
          })
        },
        onChange: function () {
          window.editor.save().then((savedData) => {
            const { blocks } = savedData
            vm.blocksLength = blocks.length
            console.log('onChange', blocks, savedData, vm.blocksLength)
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
          console.log(error)
        }
      } else {
        this.isUploaded = false
      }
      console.log('this.editingImageUrl', this.editingImageUrl)
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
