<template>
  <div class="trend-entry d-flex">
    <div class="number align-self-start">0{{ index+1 }}</div>
    <div class="trend-contents">
      <h2>
        <router-link class="h6" :to="{name:'SinglePost',params:{ postId: id }}">{{ title }}</router-link>
      </h2>
      <div class="post-meta">
        <div class="mb-2">
           <div>By <span class="text-dark">{{ creator.name }}</span></div>
            <small class="date-read"> {{ formatTime }}<span class="mx-1">•</span> 5 min read <span class="icon-star2"></span></small>

          </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: 'PostSummaryItem',
  props: {
    index: {
      type: Number,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    title: {
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
    formatTime () {
      return dayjs(this.createdAt).format('MMM DD')
    }
  }
}
</script>

<style>
</style>
