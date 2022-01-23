<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/rights' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>权限列表列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table
        v-loading="isLoading"
        border
        stripe
        :data="permissionList"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column align="center" prop="path" label="路径">
        </el-table-column>
        <el-table-column align="center" prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      permissionList: [],
      isLoading: true,
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      const [err, res] = await this.$http.get("/rights/list");
      if (err) return;
      this.permissionList = res.data;
      this.isLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
</style>