/* eslint-disable no-undef */
// import Vue from 'vue';
// import VueRouter from 'vue-router';
import Home from "./views/Home.vue";
import HomeMap from "./views/HomeMap.vue";
import Login from "./views/Login.vue";
import { isLogin } from "@utils/index";

// Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/homeMap",
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/homeMap",
    component: HomeMap,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/equipment",
    component: () => import("./views/Equipment.vue"),
  },
  {
    path: "/report",
    component: () => import("./views/Report.vue"),
  },
];
const router = new VueRouter({
  mode: "history",
  routes,
});
router.beforeEach((to, from, next) => {
  if (!isLogin()) {
    if (to.fullPath !== "/login") {
      next("/login");
    } else {
      next();
    }
  } else {
    if (to.fullPath === "/login") {
      next(from.fullPath);
    } else {
      next();
    }
  }
});
export default router;
