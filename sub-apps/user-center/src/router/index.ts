import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/list',
    name: 'UserList',
    component: () => import('../views/UserList.vue'),
    meta: { title: '用户管理' }
  },
  {
    path: '/role',
    name: 'RoleManagement',
    component: () => import('../views/RoleManagement.vue'),
    meta: { title: '角色管理' }
  },
  {
    path: '/permission',
    name: 'PermissionConfig',
    component: () => import('../views/PermissionConfig.vue'),
    meta: { title: '权限配置' }
  },
  {
    path: '/detail/:id',
    name: 'UserDetail',
    component: () => import('../views/UserDetail.vue'),
    meta: { title: '用户详情' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
];

// 判断是否在微前端环境中运行
const isInWujie = window.__WUJIE !== undefined;

// 创建路由实例，使用不同的History模式
const router = createRouter({
  // 在wujie环境中，使用memory模式避免跟基座的路由冲突
  history: createWebHistory(isInWujie ? '/user-center' : '/'),
  routes
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '未命名页面'} - 用户中心`;
  next();
});

// 路由错误处理
router.onError((error) => {
  console.error('路由错误', error);
});

export default router; 