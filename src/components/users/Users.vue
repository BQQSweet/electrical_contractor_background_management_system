<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }"
        >用户管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
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
      <el-table border stripe :data="userList" style="width: 100%">
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
              <el-button
                size="mini"
                @click="handleDelete(scope.$index, scope.row)"
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
    //获取用户列表
    async getUserList() {
      const [err, res] = await this.$http.get("/users", {
        params: this.queryInfo,
      });
      if (err) return;
      this.userList = res.data.users;
      this.total = res.data.total;
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
    //显示编辑
    showEditDialog(id) {
      this.editDialog.dialogVisible = true;
      this.getUserById(id);
    },
    //根据id查询用户信息
    async getUserById(id) {
      const [err, res] = await this.$http.get(`/users/${id}`);
      if (err) return;
      console.log(res);
      this.editForm = res.data;
    },
    //
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
  },
};
</script>

<style lang="less" scoped>
.icon {
  width: 1.8em;
  height: 1.8em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>