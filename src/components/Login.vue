<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录 -->
      <el-form
        :rules="loginRules"
        label-width="0px"
        class="login_form"
        :model="loginFrom"
        ref="loginFromRef"
      >
        <el-form-item prop="username">
          <el-input autocomplete="true" v-model="loginFrom.username">
            <svg slot="prefix" class="icon" aria-hidden="true">
              <use xlink:href="#icon-yonghu"></use></svg
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            autocomplete="off"
            v-model="loginFrom.password"
          >
            //使用svg图片才是彩色
            <svg slot="prefix" class="icon" aria-hidden="true">
              <use xlink:href="#icon-mima"></use>
            </svg>
          </el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm('loginFromRef')"
            >登录</el-button
          >
          <el-button type="warning" @click="resetForm('loginFromRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { setToken } from "../utils/auth";
export default {
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
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
      },
    };
  },
  methods: {
    //表单的预校验
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const [err, res] = await this.$http.post("/login", this.loginFrom);
          console.log(err, res);
          /* 
            token应该把保存到sessionStorage中，因为localStorage是持久化保存，sessionStorage是会话保存。
            而token应该只在网站打开期间生效
          */
          const { token } = res;
          setToken(token);
          this.$router.replace("/home");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: #021327;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>