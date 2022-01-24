<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/categories' }"
        >商品管理</el-breadcrumb-item
      >
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <div slot="header" class="clearfix">
        <el-row>
          <el-col>
            <el-button round type="warning" plain @click="showAddDialog"
              >添加分类</el-button
            ></el-col
          >
        </el-row>
      </div>
      <tree-table
        ref="table"
        index-text="#"
        :data="cateList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        border
        :show-row-hover="false"
      >
        <template slot="isOk" scope="scope">
          <i
            style="color: green; font-size: 20px"
            v-if="!scope.row.cat_delete"
            class="el-icon-success"
          ></i>
          <i
            style="color: red; font-size: 20px"
            v-else
            class="el-icon-error"
          ></i>
        </template>
        <template slot="order" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" v-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag size="mini" v-if="scope.row.cat_level === 2" type="warning"
            >三级</el-tag
          >
        </template>
        <template slot="operator">
          <el-tooltip
            :enterable="false"
            effect="dark"
            content="编辑"
            placement="top-start"
          >
            <el-button size="mini"
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
            <el-button size="mini"
              ><svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-lajitong"></use></svg
            ></el-button>
          </el-tooltip>
          <!-- <pre>{{ scope.row }}</pre> -->
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <Dialog
      :data="addDialog"
      :closeHandler="reset"
      :cancelHandler="reset"
      :confirmHandler="addCate"
    >
      <el-form
        :rules="addFormRules"
        ref="addFormRef"
        :model="addForm"
        label-width="100px"
      >
        <el-form-item label-width="100px" prop="cat_name" label="分类名称">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item
          ref="addForm"
          :model="addForm.cat_pid"
          label-width="100px"
          label="父级分类"
        >
          <el-cascader
            clearable
            :change-on-select="true"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              checkStrictly: true,
            }"
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </Dialog>
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
      selectedKeys: [],
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        { prop: "cat_name", label: "分类名称" },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        { label: "排序", type: "template", template: "order" },
        {
          label: "操作",
          type: "template",
          template: "operator",
        },
      ],
      addDialog: {
        dialogVisible: false,
        title: "添加分类",
      },
      addForm: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0,
      },
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //重置数据
    reset() {
      this.addDialog.dialogVisible = false;
      this.$refs.addFormRef.resetFields();
      this.selectedKeys = [];
    },
    //获取所有商品分类列表
    async getCateList() {
      const [err, res] = await this.$http.get("/categories", {
        params: this.queryInfo,
      });
      if (err) return;
      console.log(res);
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //单页数据量改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //页码改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //显示添加分类对话框
    showAddDialog() {
      this.getParentCateList();
      this.addDialog.dialogVisible = true;
    },
    //获取父级分类列表
    async getParentCateList() {
      const [err, res] = await this.$http.get("/categories", {
        params: {
          type: 2,
        },
      });
      if (err) return;
      this.parentCateList = res.data;
    },
    //父级列表改变
    parentCateChange() {
      const { selectedKeys: keys } = this;
      if (keys.length > 0) {
        this.addForm.cat_pid = keys[keys.length - 1];
        this.addForm.cat_level = keys.length;
      } else {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
    },
    //添加分类
    addCate() {
      this.$refs.addFormRef.validate(async (v) => {
        if (!v) return;
        const [err] = await this.$http.post("/categories", this.addForm);
        if (err) return;
        this.addDialog.dialogVisible = false;
        this.getCateList();
        this.$message.success("添加成功");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>