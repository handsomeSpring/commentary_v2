import { createWebHashHistory, createRouter } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken, removeToken } from "@/utils/auth";
import eventEmitter from "@/utils/eventEmitter";
import { useUserStore } from "@/store/user";

const pages = import.meta.glob("../views/**/page.js");
const pageComps = import.meta.glob("../views/**/index.vue", {
  eager: true,
  import: "default",
});
const routes = Object.entries(pages).map(([path, meta]) => {
  const pageJSPath = path;
  path = path.replace("../views", "").replace("/page.js", "");
  path = path || "/";
  const name = path.split("/").filter(Boolean).join("-") || "index";
  const compPath = pageJSPath.replace("page.js", "index.vue");
  return {
    path,
    name,
    component: pageComps[compPath],
    meta,
  };
});
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

const whiteList = ["/register","/login"];
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  NProgress.start(); // start progress bar
  if (whiteList.includes(to.path)) {
    next(true);
  }
  if (to.matched.length === 0 && to.path !== '/') next("/404");
  if (getToken()) {
    if(to.path === '/'){
      const { data: info, status } = await getUserInfo();
      if(status !== 200) return;
      userStore.setAllUserInfos(info);
      next({
        path:'/home'
      })
    }else{
      next();
    }
  } else {
    next({ path: "/login" });
  }
});

router.afterEach(() => {
  NProgress.done(); // finish progress bar
});

// router.onError((error) => {
//   console.log(error, "路由异常..............");
//   location.reload();
// });
eventEmitter.on("API:UN_AUTH", () => {
  removeToken();
  router.push("/login");
});
export default router;
