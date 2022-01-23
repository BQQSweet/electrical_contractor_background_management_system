<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/roles' }"
        >权限管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-button type="warning" round plain>添加角色</el-button>
      </div>
      <!-- 表格部分 -->
      <el-table
        v-loading="isLoading"
        border
        stripe
        :data="rolesList"
        style="width: 100%"
      >
        <el-table-column align="center" type="expand">
          <template slot-scope="scope">
            <div v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <el-divider v-if="i1 === 0"></el-divider>
              <el-row class="dc">
                <el-col :span="5">
                  <el-tag closable @close="deleteTag(scope.row, item1.id)">
                    {{ item1.authName }}
                  </el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="19">
                  <div v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-row class="dc">
                      <el-col :span="6">
                        <el-tag
                          @close="deleteTag(scope.row, item2.id)"
                          type="success"
                          closable
                        >
                          {{ item2.authName }}
                        </el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <el-col :span="18">
                        <el-tag
                          @close="deleteTag(scope.row, item3.id)"
                          type="warning"
                          closable
                          v-for="item3 in item2.children"
                          :key="item3.id"
                        >
                          {{ item3.authName }}
                        </el-tag>
                      </el-col>
                    </el-row>
                    <el-divider
                      v-if="i2 !== item1.children.length - 1"
                    ></el-divider>
                  </div>
                </el-col>
              </el-row>
              <el-divider></el-divider>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          type="index"
          label="#"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="编辑"
              placement="top-start"
            >
              <el-button size="mini" @click="showEditDialog(scope.row.id)"
                ><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-bianji"></use></svg
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="删除"
              placement="top-start"
            >
              <el-button size="mini" @click="deleteById(scope.row.id)"
                ><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-lajitong"></use></svg
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配权限"
              placement="top-start"
            >
              <el-button size="mini" @click="showSetPermissionDialog(scope.row)"
                ><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shezhi"></use></svg
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格部分 end-->
    </el-card>
    <!-- 卡片视图 end-->

    <!-- 分配权限对话框 -->
    <Dialog
      :data="dialogData"
      :closeHandler="closeDialog"
      :cancelHandler="closeDialog"
      :confirmHandler="assignPermissions"
    >
      <el-tree
        ref="tree"
        :data="permissionList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="defaultKeys"
      >
      </el-tree>
    </Dialog>
    <!-- 分配权限对话框 end-->
  </div>
</template>

<script>
import Dialog from "../Dialog.vue";
export default {
  components: {
    Dialog,
  },
  data() {
    return {
      rolesList: [],
      isLoading: true,
      dialogData: {
        dialogVisible: false,
        title: "分配权限",
      },
      permissionList: [],
      defaultProps: {
        children: "children",
        label: "authName",
      },
      defaultKeys: [],
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const [err, res] = await this.$http.get("/roles");
      if (err) return;
      this.rolesList = res.data;
      this.isLoading = false;
    },

    /* 
    role:角色对象
    pid:权限id
  */
    async deleteTag(role, pid) {
      const result = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (result !== "confirm") return this.$message.info("取消删除");
      const [err, res] = await this.$http.delete(
        `/roles/${role.id}/rights/${pid}`
      );
      if (err) return;
      role.children = res.data; //防止整个页面刷新
    },
    //分配权限
    showSetPermissionDialog(role) {
      this.roleId = role.id;
      this.getPermissionList();
      this.getNodes(role, this.defaultKeys);
      setTimeout(() => {
        this.dialogData.dialogVisible = true;
      });
    },
    //获取权限列表
    async getPermissionList() {
      const [err, res] = await this.$http.get("rights/tree");
      if (err) return;
      console.log(res);
      this.permissionList = res.data;
    },
    //关闭对话框
    closeDialog() {
      this.defaultKeys = [];
      this.dialogData.dialogVisible = false;
    },
    //获取所有三级节点id
    getNodes(node, arr = []) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((e) => {
        return this.getNodes(e, arr);
      });
    },
    //分配权限
    async assignPermissions() {
      const rids = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys(),
      ].toString();
      console.log(rids);
      const [err] = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids,
      });
      if (err) return;
      this.getRolesList();
      this.$message.success("权限分配成功");
      this.closeDialog();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body {
  height: 350px;
  overflow-y: auto;
}
</style>