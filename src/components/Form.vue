<template>
  <el-form
    :model="formData"
    status-icon
    :rules="formRules"
    :ref="formRef"
    label-width="100px"
  >
    <el-form-item
      v-for="(item, i) in Object.keys(formItems)"
      :key="i"
      :label="formItems[item].label"
      :prop="formItems[item].prop"
    >
      <el-input
        :disabled="formItems[item].disabled"
        v-model="formData[item]"
        :autocomplete="formItems[item].autocomplete"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    formRules: {
      type: Object,
      default: () => {},
    },
    formRef: {
      type: String,
      default: "formRef",
    },
    formItems: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    reset() {
      this.$refs[this.formRef].resetFields();
    },
    validate(cb) {
      this.$refs[this.formRef].validate((valid) => {
        cb(valid);
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
