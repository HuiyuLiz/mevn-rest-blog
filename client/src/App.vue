<template>
  <div>
    <Spinner v-if="isLoading"></Spinner>
    <TheHeader></TheHeader>
    <router-view v-slot="slotProps">
      <transition name="route" mode="out-in">
        <component :is="slotProps.Component"></component>
      </transition>
    </router-view>
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
  },
  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    }
  }
}
</script>

<style lang="scss">
@import "./assets/fonts/icomoon/style.css";
@import "./assets/scss/style";

.route-enter-from{
  opacity:0;
  transform:translateY(-30px)

}
.route-leave-to{
  opacity:0;
  transform:translateY(30px)

}

.route-enter-active{
  transition: all .3s ease-in;

}
.route-leave-active{
  transition: all .3s ease-out;

}

.route-enter-to,
.route-leave-from{
  opacity:1;
  transform:translateY(0px)

}
</style>
