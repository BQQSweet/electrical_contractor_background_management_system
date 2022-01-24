<template>
  <div style="height: 100%">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }"
        >用户管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              clearable
              placeholder="请输入内容"
              v-model="queryInfo.query"
              @clear="getUserList"
            >
              <el-button
                @click="getUserList"
                slot="append"
                icon="el-icon-search"
              ></el-button> </el-input
          ></el-col>
          <el-col :span="4">
            <el-button
              round
              @click="addDialog.dialogVisible = true"
              type="warning"
              plain
              >添加用户</el-button
            ></el-col
          >
        </el-row>
      </div>
      <el-table
        v-loading="isLoading"
        border
        stripe
        :data="userList"
        style="width: 100%"
      >
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" prop="username" label="姓名">
        </el-table-column>
        <el-table-column align="center" prop="email" label="邮箱">
        </el-table-column>
        <el-table-column align="center" prop="mobile" label="电话">
        </el-table-column>
        <el-table-column align="center" prop="role_name" label="角色">
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              @change="updateMgState(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#eee"
            >
            </el-switch>
          </template>
        </el-table-column>
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
              content="分配角色"
              placement="top-start"
            >
              <el-button size="mini" @click="showAssignDialog(scope.row)"
                ><svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shezhi"></use></svg
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <Dialog
      :cancelHandler="() => closeDialog(addDialog)"
      :data="addDialog"
      :confirmHandler="() => addUser('addFormRef')"
      :closeHandler="() => dialogClosed('addFormRef')"
    >
      <Form
        formRef="addFormRef"
        :formData="addForm"
        :formItems="addFormItems"
        ref="addFormRef"
        :formRules="addFormRules"
      ></Form>
    </Dialog>

    <!-- 编辑用户对话框 -->
    <Dialog
      :cancelHandler="() => closeDialog(editDialog)"
      :data="editDialog"
      :closeHandler="() => dialogClosed('editFormRef')"
      :confirmHandler="() => editUser('editFormRef')"
    >
      <Form
        formRef="editFormRef"
        :formData="editForm"
        :formItems="editFormItems"
        ref="editFormRef"
        :formRules="editFormRules"
      ></Form>
    </Dialog>

    <!-- 分配角色对话框 -->
    <Dialog
      :cancelHandler="() => closeDialog(assignDialog)"
      :data="assignDialog"
      :confirmHandler="updateRole"
    >
      <h4>当前用户:{{ userInfo.username }}</h4>
      <h4>当前角色:{{ userInfo.role_name }}</h4>
      <el-select v-model="newRoleId" placeholder="请选择">
        <el-option
          v-for="item in rolesList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </Dialog>
  </div>
</template>

<script>
import { checkEmail, checkMobile } from "../../utils/validate";
import Dialog from "../../components/Dialog.vue";
import Form from "../../components/Form.vue";
export default {
  components: {
    Dialog,
    Form,
  },
  data() {
    return {
      addDialog: {
        dialogVisible: false,
        title: "添加用户",
      },
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormItems: {
        username: {
          label: "用户名",
          prop: "username",
        },
        password: {
          label: "密码",
          prop: "password",
        },
        email: {
          label: "邮箱",
          prop: "email",
        },
        mobile: {
          label: "手机号码",
          prop: "mobile",
        },
      },
      editDialog: {
        dialogVisible: false,
        title: "修改用户",
      },
      editForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editFormItems: {
        username: {
          label: "用户名",
          prop: "username",
          disabled: true,
        },
        email: {
          label: "邮箱",
          prop: "email",
        },
        mobile: {
          label: "手机号码",
          prop: "mobile",
        },
      },
      assignDialog: {
        dialogVisible: false,
        title: "分配角色",
      },

      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      userList: [],
      total: 0,
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在3到12个字符之间 ",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在6到12个字符之间 ",
            trigger: "blur",
          },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      editFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在3到12个字符之间 ",
            trigger: "blur",
          },
        ],
        email: [{ validator: checkEmail, trigger: "blur" }],
        mobile: [{ validator: checkMobile, trigger: "blur" }],
      },
      isLoading: true,
      userInfo: {}, //需要被分配角色的用户信息
      rolesList: [],
      newRoleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //关闭dialog
    closeDialog(dialog) {
      dialog.dialogVisible = false;
    },
    //显示dialog
    showDialog(dialog) {
      dialog.dialogVisible = true;
    },
    //获取用户列表
    async getUserList() {
      this.isLoading = true;
      const [err, res] = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (err) return;
      this.userList = res.data.users;
      this.total = res.data.total;
      this.isLoading = false;
    },
    //用户状态更新
    async updateMgState(userinfo) {
      const [err] = await this.$http.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (err) {
        userinfo.mg_state = !userinfo.mg_state;
        return;
      }
      this.$message.success("用户状态更新成功");
    },
    //单页数据量改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //重置用户表单
    dialogClosed(formName) {
      this.$refs[formName].reset();
    },
    //添加用户
    async addUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return;
        else {
          const [err] = await this.$http.post("/users", this.addForm);
          if (err) return;
          this.$message.success("用户添加成功");
          this.getUserList();
          this.closeDialog(this.addDialog);
          this.$refs[formName].reset();
        }
      });
    },
    //编辑用户
    async editUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) return;
        else {
          const [err] = await this.$http.put(
            `/users/${this.editForm.id}`,
            this.editForm
          );
          if (err) return;
          this.$message.success("用户修改成功");
          this.getUserList();
          this.closeDialog(this.editDialog);
          this.$refs[formName].reset();
        }
      });
    },
    //显示编辑对话框
    showEditDialog(id) {
      this.showDialog(this.editDialog);
      this.getUserById(id);
    },
    //根据id查询用户信息
    async getUserById(id) {
      const [err, res] = await this.$http.get(`/users/${id}`);
      if (err) return;
      console.log(res);
      this.editForm = res.data;
    },
    //根据id删除用户
    async deleteById(id) {
      const res = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (res !== "confirm") {
        return this.$message.info("取消删除");
      }
      const [err] = await this.$http.delete(`/users/${id}`);
      if (err) return;
      this.$message.success("删除成功");
      this.getUserList();
    },
    //获取所有角色列表
    async getRolesList() {
      const [err, res] = await this.$http.get("/roles");
      if (err) return;
      this.rolesList = res.data;
    },
    //显示分配角色对话框
    showAssignDialog(userInfo) {
      this.getRolesList();
      this.userInfo = userInfo;
      this.showDialog(this.assignDialog);
    },
    //更新用户角色
    async updateRole() {
      if (!this.newRoleId) return this.$message.error("请选择角色");
      const [err] = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.newRoleId,
      });
      if (err) return;
      this.getUserList();
      this.closeDialog(this.assignDialog);
      this.$message.success("角色更新成功");
    },
  },
};
</script>

<style lang="less" scoped>
</style>