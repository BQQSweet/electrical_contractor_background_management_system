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
</style>
