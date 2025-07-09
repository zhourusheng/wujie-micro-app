import { createRouter, createWebHistory } from 'vue-router';
import WujieView from '../views/WujieView.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';
import Login from '../views/Login.vue';
import Forbidden from '../views/Forbidden.vue';
import { authGuard } from '../guards/auth-guard';

// 定义路由
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录',
      layout: 'blank' // 使用空白布局
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: Forbidden,
    meta: { 
      title: '禁止访问',
      layout: 'blank' // 使用空白布局
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { 
      title: '首页',
      requiresAuth: true
    }
  },
  {
    path: '/home',
    name: 'HomePage',
    component: Home,
    meta: { 
      title: '首页',
      requiresAuth: true
    }
  },
  // 用户中心子应用
  {
    path: '/user-center/:pathMatch(.*)*',
    name: 'UserCenter',
    component: WujieView,
    props: (route: any) => ({ 
      subApp: 'user-center', 
      path: Array.isArray(route.params.pathMatch) 
        ? `/${route.params.pathMatch.join('/')}` 
        : route.params.pathMatch
          ? `/${route.params.pathMatch}`
          : '/list'
    }),
    meta: { 
      title: '用户中心',
      subApp: 'user-center',
      requiresAuth: true
    }
  },
  // 商品管理子应用
  {
    path: '/product-management/:pathMatch(.*)*',
    name: 'ProductManagement',
    component: WujieView,
    props: (route: any) => ({ 
      subApp: 'product-management', 
      path: Array.isArray(route.params.pathMatch) 
        ? `/${route.params.pathMatch.join('/')}` 
        : route.params.pathMatch
          ? `/${route.params.pathMatch}`
          : '/list'
    }),
    meta: { 
      title: '商品管理',
      subApp: 'product-management',
      requiresAuth: true
    }
  },
  // 订单系统子应用
  {
    path: '/order-system/:pathMatch(.*)*',
    name: 'OrderSystem',
    component: WujieView,
    props: (route: any) => ({ 
      subApp: 'order-system', 
      path: Array.isArray(route.params.pathMatch) 
        ? `/${route.params.pathMatch.join('/')}` 
        : route.params.pathMatch
          ? `/${route.params.pathMatch}`
          : '/list'
    }),
    meta: { 
      title: '订单系统',
      subApp: 'order-system',
      requiresAuth: true
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: '页面不存在',
      layout: 'blank' // 使用空白布局
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: routes as any
});

// 注册全局前置守卫
router.beforeEach(authGuard);

export default router; 