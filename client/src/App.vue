<template>
  <div>
    <TheHeader></TheHeader>
    <router-view></router-view>
    <TheFooter></TheFooter>
  </div>
</template>

<script>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'

export default {
  components: {
    TheHeader,
    TheFooter
  }
}
</script>

<style lang="scss">
@import "./assets/fonts/icomoon/style.css";
@import "./assets/scss/style";
</style>
