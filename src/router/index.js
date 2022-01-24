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
    redirect: "/home/welcome",
    children: [
      {
        path: "welcome",
        meta: {
          path: "welcome",
        },
        component: () =>
          import(/* webpackChunkName: 'home' */ "@/components/Welcome"),
      },
      {
        path: "users",
        meta: {
          path: "users",
        },
        component: () =>
          import(/* webpackChunkName: 'home' */ "@/components/users/Users"),
      },
      {
        path: "rights",
        meta: {
          path: "rights",
        },
        component: () =>
          import(
            /* webpackChunkName: 'permission' */ "@/components/permission/Permission"
          ),
      },
      {
        path: "roles",
        meta: {
          path: "roles",
        },
        component: () =>
          import(
            /* webpackChunkName: 'permission' */ "@/components/permission/Roles"
          ),
      },
      {
        path: "categories",
        meta: {
          path: "categories",
        },
        component: () =>
          import(
            /* webpackChunkName: 'permission' */ "@/components/goods/Cate"
          ),
      },
    ],
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
