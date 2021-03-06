<template>
  <div>
    <div class="col-md-4 order-md-2">
      <img :src="formatImage" class="card-img w-100 rounded-0" />
    </div>
    <div class="col-md-7 order-md-1">
      <div class="card-body p-0" >
        <h6 class="text-dark h6 pointer mb-3 font-weight-bold" @click="getPost">
          {{ title }}
        </h6>
        <template v-if="formatCleanText">
          <p>{{ formatCleanText }}</p>
        </template>
        <div class="post-meta d-md-flex justify-content-between">
          <div class="mb-2" v-if="creator">
            <span class="date-read">By <span class="text-dark">{{ creator.name }}&nbsp;&nbsp;</span>  {{ formatTime }}<span class="mx-1">•</span> 5 min read <span class="icon-star2"></span></span>
          </div>
        </div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import parseJson from 'parse-json'
export default {
  emits: ['get-post', 'editing-post', 'delete-post'],
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    creator: {
      type: Object,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  },
  name: 'PostItem',
  data () {
    return {
      formatContent: '',
      substringLength: 60
    }
  },
  computed: {
    formatImage () {
      return `${process.env.VUE_APP_API_URL}/${this.imageUrl}`
    },
    formatTime () {
      return dayjs(this.createdAt).format('MMM DD')
    },
    jsonParseContent () {
      return this.content !== '' ? parseJson(this.content) : ''
    },
    formatCleanText () {
      const content = this.formatDescription.replace(/<\/?[^>]+(>|$)/g, '')
      const substring = content.substring(0, this.substringLength)
      const splitContent = content.length > this.substringLength ? substring + '...' : substring
      return splitContent
    },
    formatDescription () {
      let content = this.jsonParseContent.blocks.length > 0 && this.jsonParseContent !== undefined ? this.jsonParseContent.blocks[0] : ''
      switch (content.type) {
        case 'header':
          content = `<h${content.data.level}>${content.data.text}</h${content.data.level}>`
          break
        case 'paragraph':
          content = `<p>${content.data.text}</p>`
          break
        case 'delimiter':
          content = '<hr />'
          break
        case 'image':
          content = `<img class="img-fluid" src="${content.data.file.url}" title="${content.data.caption}" /><br /><em>${content.data.caption}</em>`
          break
        case 'list':
          content = '<ul>'
          content.data.items.forEach(function (li) {
            content = `<li>${li}</li>`
          })
          content = '</ul>'
          break
        default:
          console.log('Unknown content type', content.type)
          break
      }

      return content
    },
    formatHtml () {
      let html = ''
      this.jsonParseContent.blocks.forEach((block) => {
        switch (block.type) {
          case 'header':
            html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
            break
          case 'paragraph':
            html += `<p>${block.data.text}</p>`
            break
          case 'delimiter':
            html += '<hr />'
            break
          case 'image':
            html += `<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`
            break
          case 'list':
            html += '<ul>'
            block.data.items.forEach(function (li) {
              html += `<li>${li}</li>`
            })
            html += '</ul>'
            break
          default:
            console.log('Unknown block type', block.type)
            break
        }
      })
      return html
    }
  },
  methods: {
    getPost () {
      this.$emit('get-post', this.id)
    }
  },
  mounted () {
  }

}
</script>

<style>
</style>
