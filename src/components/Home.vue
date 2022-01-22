<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
import { clearToken } from "../utils/auth";
export default {
  methods: {
    logout() {
      clearToken();
      this.$router.replace("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>