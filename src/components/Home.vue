<template>
  <el-container>
    <el-header>
      <div>
        <i class="el-icon-loading"></i>
        <h3>后台管理系统</h3>
      </div>
      <el-button @click="logout">退出</el-button></el-header
    >
    <el-container>
      <el-aside :width="isCollapse ? '' : '200px'">
        <div class="toggle-button" @click="isCollapse = !isCollapse">
          <i class="el-icon-arrow-left"></i>
        </div>
        <el-menu
          :default-active="defaultActive"
          router
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#f3a683"
          text-color="#333"
          active-text-color="#e15f41"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item1.id + ''"
            v-for="item1 in menuList"
            :key="item1.id"
          >
            <template slot="title">
              <svg class="icon" aria-hidden="true">
                <use v-bind:xlink:href="iconsList[item1.id]"></use>
              </svg>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
              :index="item2.path"
              v-for="item2 in item1.children"
              :key="item2.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <transition name="slide-fade" mode="out-in" :appear="true">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { clearToken } from "../utils/auth";
export default {
  data() {
    return {
      isCollapse: false,
      defaultActive: "",
      menuList: [],
      iconsList: {
        125: "#icon-yonghuguanli",
        103: "#icon-jiaoseguanli",
        101: "#icon-taocancangku",
        102: "#icon-dingdan",
        145: "#icon-shuju",
      },
    };
  },
  created() {
    this.getMenuList();
    this.initMenu();
  },
  methods: {
    //登出
    logout() {
      clearToken();
      this.$router.replace("/login");
    },
    //获取左侧导航菜单数据
    async getMenuList() {
      const [err, res] = await this.$http.get("/menus");
      if (err) return;
      this.menuList = res.data;
    },
    //设置菜单高亮
    initMenu() {
      const { path } = this.$route.meta;
      console.log(this.$router);

      this.defaultActive = path;
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
  color: #333;
  margin-right: 10px;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: @themeColor;
  color: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    display: flex;
    align-items: center;
    color: #fff;
    i {
      font-size: 26px;
    }
  }
}

.el-aside {
  background-color: #fff;
  transition: all 0.5s !important;
  .toggle-button {
    background-color: #333;
    color: #fff;
    text-align: center;
    font-size: 1.2em;
  }
  /deep/ .el-submenu__title {
    display: flex;
    align-items: center;
    i {
      color: #fff;
    }
  }
  /deep/ .el-menu {
    border-right: none;
    i {
      color: #333;
    }
  }
}

.el-main {
  background-color: rgb(245, 245, 245);
  color: #333;
}
</style>
