import Vue from 'vue';
import vueRouter from 'vue-router';
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = vueRouter.prototype.push
import savetoken from '../assets/js/token';
vueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(vueRouter);

const register=resolve=>require(['../view/web/register.vue'],resolve);
const login=resolve=>require(['../view/web/login.vue'],resolve);
const index=resolve=>require(['../view/manage/index.vue'],resolve);
const user=resolve=>require(['../view/manage/user.vue'],resolve);
const news=resolve=>require(['../view/manage/news.vue'],resolve);
const sort=resolve=>require(['../view/manage/sort.vue'],resolve);
const shop=resolve=>require(['../view/manage/shop.vue'],resolve);
const order=resolve=>require(['../view/manage/order.vue'],resolve);
const comment=resolve=>require(['../view/manage/comment.vue'],resolve);
const router =new vueRouter({
    routes:[
        {
            path:"/",
            redirect:"/login"
        },
        {
            path:"/register",
            component:register
            // component:resolve => require(['../view/manage/register.vue'],resolve)
        },
        {
            path:"/login",
            component:login
        },
        // {
        //     path:"/manage",
        //     component:index
        // },
        {
            // path:"/manage/:name",
            path:"/manage/:hostname",
            props:true,
            component:index,
            children:[
                {
                    path:"/manage/user/:hostname",
                    component:user,
                    props:true
                    // props: { default: true}
                },
                {
                    path:"/manage/news/:hostname",
                    component:news,
                    props: { default: true}
                },
                {
                    path:"/manage/order/:hostname",
                    component:order,
                    props: { default: true}
                },
                {
                    path:"/manage/shop/:hostname",
                    component:shop,
                    props: { default: true}
                },
                {
                    path:"/manage/sort/:hostname",
                    component:sort,
                    props: { default: true}
                },
                {
                    path:"/manage/comment/:hostname",
                    component:comment,
                    props: { default: true}
                }
            ]
        },
        // 路由重定向
        {
            path:"/*",
            redirect: "/login"
        }
    ],
    mode:"history"
});
//导航守卫，如果没登陆，只能去登录页，反之，就在登录页
router.beforeEach((to, from, next) => {
if(to.path=="/login" ||to.path=="/register"){
    return next();
}
else {
    const tokenStr=savetoken.getCookie('my_token');
    if(!tokenStr){
        return next("/login");
    }
    else return next();
}
})
export default router;