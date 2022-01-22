import Vue from "vue";
import VueRouter from "vue-router";
import { getToken } from "../utils/auth";
import { Message } from "element-ui";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () =>
      import(/* webpackChunkName: 'login' */ "@/components/Login"),
  },
  {
    path: "/home",
    component: () => import(/* webpackChunkName: 'home' */ "@/components/Home"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  if (!getToken()) {
    Message.warning("登录已过期，请重新登录");
    return next("/login");
  }
  next();
});
export default router;
