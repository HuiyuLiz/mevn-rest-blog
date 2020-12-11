<template>
  <div class="col-lg-8 single-content">
    <h1 class="mb-4">{{ title }}</h1>
    <div class="post-meta d-flex mb-5">
      <div class="bg-info mr-3 post-profile-thumbnail d-flex justify-content-center align-items-center">
        <span class="text-light h3 mb-0">{{ creator.name.substr(0, 1).toLocaleUpperCase()}}</span>
      </div>
      <div class="vcard" v-if="creator">
        <span class="d-block"
          ><a href="#">{{ creator.name }}</a> </span
        >
        <span class="date-read"
          >{{ formatTime }}</span>
      </div>
    </div>
        <p class="mb-5">
      <img
        :src="formatImage"
        alt="Image"
        class="img-fluid"
      />
    </p>
    <template v-if="content">
      <div v-html="formatHtml"></div>
    </template>

  </div>
</template>

<script>
import dayjs from 'dayjs'
import parseJson from 'parse-json'
export default {
  name: 'SinglePostItem',
  props: {
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
  }
}
</script>

<style>
</style>
