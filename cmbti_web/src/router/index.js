import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

//用户
import user_login from '@/components/user/user_login'
import user_register from '@/components/user/user_register'
import user_reset_password from '@/components/user/user_reset_password'
import user_verify from '@/components/user/user_verify'

//home页面
import home_index from '@/components/home/home_index'

// mbti
import mbti from '@/components/mbti/mbti'

// test
import test from '@/components/test/test'
import test_mbti93 from '@/components/test/test_mbti93'
import mbti93_report from '@/components/test/mbti93_report'
import test_type16 from '@/components/test/test_type16'
import type16_report from '@/components/test/type16_report'
import test_mid8 from '@/components/test/test_mid8'

// example
import example from '@/components/example/example'
import example_details from '@/components/example/details'

// document
import document from '@/components/document/document'

// forum
import forum from '@/components/forum/forum'
import forum_item from '@/components/forum/forum_item'

// 个人中心
import my_home from '@/components/my/my_home'



const vueRouter = new Router({
  mode:'history',
  routes: [
    {path:'/index',redirect:'/'},
    // redirect:'pool/systemStts',
    //Home
    {path:'/',name:'1-1',component:home_index},

    // mbti
    {path:'/mbti',component:mbti},

    // test
    {path:'/test',component:test},
    {path:'/test/mbti93',component:test_mbti93},
    {path:'/test/mbti93/report',component:mbti93_report},
    {path:'/test/type16',component:test_type16},
    {path:'/test/type16/report',component:type16_report},
    {path:'/test/mid8',component:test_mid8},

    // example
    {path:'/example',component:example},
    {path:'/example/:id',component:example_details},

    // document
    {path:'/document',component:document},

    // forum 交流区
    {path:'/forum',component:forum},
    {path:'/forum/:articleID',component:forum_item},
    // {path:'/forum',component:forum,  meta:{requireAuth: true }},
    
    //个人中心
    {path:'/my',component:my_home},
    
    // 用户登陆、注册、找回密码
    { path: '/user/login', component: user_login },
    { path: '/user/register',component: user_register},
    { path: '/user/verify',component: user_verify },
    { path: '/user/reset',component: user_reset_password },


    { path: '*',redirect:'/'}

 
  ]
});

vueRouter.beforeEach((to, from, next) => {
  var reg = /^\/user\//;
  // 确保登录后能跳转回到原页面
  if(!reg.test(from.path) && reg.test(to.path)){
     sessionStorage.setItem('beforeLoginPath',from.fullPath);
  } 
  //需要登录的路由进行拦截
   if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
       if (localStorage.getItem('USER')) {// 判断是否登录
          next()
       } else {// 没登录则跳转到登录界面
          alert("需要登录！");
          next({
            path: '/user/login',
            query: {redirect: to.fullPath}
          })
      }
  } else {
     next()
  }
  // next();
  // if (to.name === 'accountSet') {
    
  // }
  // next()
})
// 登录状态管理逻辑：
// 1.session时间短（如：10分钟）：localStorage存储状态+时间，路由拦截时核对
// 2.session时间长（如：一个月）：localStorage存储状态，路由拦截时核对
// 判断是否需要登录权限 以及是否登录

// router.beforeEach((to, from, next) => {
//  if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
//  if (localStorage.getItem('username')) {// 判断是否登录
//   next()
//  } else {// 没登录则跳转到登录界面
//   next({
//   path: '/Register',
//   query: {redirect: to.fullPath}
//   })
//  }
//  } else {
//  next()
//  }

export default vueRouter;

// https://segmentfault.com/a/1190000011426274 vue的路由懒加载和组件的按需加载
