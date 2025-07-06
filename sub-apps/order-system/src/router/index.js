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
    redirect: '/order/list'
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: OrderList,
    meta: {
      title: '订单列表'
    }
  },
  {
    path: '/order/detail/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情'
    }
  },
  {
    path: '/order/return',
    name: 'ReturnManage',
    component: ReturnManage,
    meta: {
      title: '退换货管理'
    }
  },
  {
    path: '/order/invoice',
    name: 'InvoiceManage',
    component: InvoiceManage,
    meta: {
      title: '发票管理'
    }
  },
  {
    path: '/order/logistics',
    name: 'LogisticsTrack',
    component: LogisticsTrack,
    meta: {
      title: '物流跟踪'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/order/' : '/',
  routes
});

export default router; 