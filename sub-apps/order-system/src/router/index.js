import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 路由懒加载
const OrderList = () => import('../views/OrderList.vue');
const OrderDetail = () => import('../views/OrderDetail.vue');
const ReturnManage = () => import('../views/ReturnManage.vue');
const InvoiceManage = () => import('../views/InvoiceManage.vue');
const LogisticsTrack = () => import('../views/LogisticsTrack.vue');

const routes = [
  {
    path: '/',
    redirect: '/list'
  },
  {
    path: '/list',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: '订单列表'
    }
  },
  {
    path: '/detail/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/return',
    name: 'ReturnManage',
    component: ReturnManage,
    meta: {
      title: '退换货管理'
    }
  },
  {
    path: '/delivery',
    name: 'DeliveryManage',
    component: InvoiceManage,
    meta: {
      title: '发货管理'
    }
  },
  {
    path: '/logistics',
    name: 'LogisticsTrack',
    component: LogisticsTrack,
    meta: {
      title: '物流跟踪'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  routes
});

export default router; 