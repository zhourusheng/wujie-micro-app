import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import WujieView from '../views/WujieView.vue';
import Home from '../views/Home.vue';
import NotFound from '../views/NotFound.vue';

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  // 用户中心子应用
  {
    path: '/user-center/:pathMatch(.*)*',
    name: 'UserCenter',
    component: WujieView,
    meta: { 
      title: '用户中心',
      subApp: 'user-center'
    }
  },
  // 商品管理子应用
  {
    path: '/product/:pathMatch(.*)*',
    name: 'ProductManagement',
    component: WujieView,
    meta: { 
      title: '商品管理',
      subApp: 'product-management'
    }
  },
  // 订单系统子应用
  {
    path: '/order/:pathMatch(.*)*',
    name: 'OrderSystem',
    component: WujieView,
    meta: { 
      title: '订单系统',
      subApp: 'order-system'
    }
  },
  // 数据分析子应用
  {
    path: '/analytics/:pathMatch(.*)*',
    name: 'DataAnalytics',
    component: WujieView,
    meta: { 
      title: '数据分析',
      subApp: 'data-analytics'
    }
  },
  // 营销活动子应用
  {
    path: '/marketing/:pathMatch(.*)*',
    name: 'Marketing',
    component: WujieView,
    meta: { 
      title: '营销活动',
      subApp: 'marketing'
    }
  },
  // 库存管理子应用
  {
    path: '/inventory/:pathMatch(.*)*',
    name: 'Inventory',
    component: WujieView,
    meta: { 
      title: '库存管理',
      subApp: 'inventory'
    }
  },
  // 系统设置子应用
  {
    path: '/settings/:pathMatch(.*)*',
    name: 'Settings',
    component: WujieView,
    meta: { 
      title: '系统设置',
      subApp: 'settings'
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: '页面不存在' }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '未命名页面'} - 微前端平台`;
  next();
});

export default router; 