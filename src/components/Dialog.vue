<template>
  <el-dialog
    :title="data.title"
    :visible.sync="data.dialogVisible"
    @close="closeHandler"
  >
    <slot />
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelHandler">取 消</el-button>
      <el-button type="primary" @click="confirmHandler">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({
        dialogVisible: false,
        title: "提示",
      }),
    },
    closeHandler: {
      type: Function,
      default: () => {},
    },
    confirmHandler: {
      type: Function,
      default: () => {},
    },
    cancelHandler: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style lang="less" scoped>
</style>