<template>
  <div id="app">
    <transition name="slide-fade" mode="out-in" :appear="true">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
};
</script>

<style>
.icon {
  width: 1.3em;
  height: 1.3em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
