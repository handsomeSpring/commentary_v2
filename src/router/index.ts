import { createWebHashHistory,createRouter } from "vue-router";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken, removeToken } from "@/utils/auth";
import eventEmitter from "@/utils/eventEmitter";

const pages = import.meta.glob('../views/**/page.js');
const pageComps = import.meta.glob('../views/**/index.vue',{
    eager:true,
    import:'default'
})
const routes = Object.entries(pages).map(([path,meta])=>{
    const pageJSPath = path;
    path = path.replace('../views','').replace('/page.js','');
    path = path || '/';
    const name = path.split('/').filter(Boolean).join('-') || 'index';
    const compPath = pageJSPath.replace('page.js','index.vue')
    return {
        path,
        name,
        component:pageComps[compPath],
        meta
    }
});
const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

const whiteList = [
  '/register'
];
router.beforeEach((to, from, next) => {
    NProgress.start(); // start progress bar
    if(whiteList.includes(to.path)){
      next();
    }
    if(to.path === '/'){
        next({path:'/login'});
    }
    if(!getToken() && !['/login','/','/getnumber'].includes(to.path)){
        next('/login');
    }
    if(to.matched.length === 0) next('/404');
    next();
  });
  
  router.afterEach(() => {
    NProgress.done(); // finish progress bar
  });
  
  router.onError(error => {
    console.log(error, "路由异常..............");
    location.reload();
  });
  eventEmitter.on('API:UN_AUTH',() => {
    console.log('接受到了');
    removeToken();
    router.push('/login')
  })
export default router;