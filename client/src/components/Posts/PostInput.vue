<template>
  <div>
    <h3>PostInput</h3>
    <label for="title">title</label>
    <input type="text" class="" :value="title" @input="updateTitle">
    <label for="age">age</label>
    <input type="number" class="" :value="age" @input="inputAge">
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    },
    age: {
      type: Number,
      required: false
    }
  },
  methods: {
    updateTitle (event) {
      this.$emit('update:title', event.target.value)
    },
    inputAge (e) {
      this.$emit('update:age', parseInt(e.target.value))
    }
  }
}
</script>

<style>

</style>
