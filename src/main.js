import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import "./assets/css/global.css";
import "./assets/fonts/iconfont.js";
import http from "./utils/http";
import ZkTable from "vue-table-with-tree-grid";

Vue.component("tree-table", ZkTable);

Vue.prototype.$http = http;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
