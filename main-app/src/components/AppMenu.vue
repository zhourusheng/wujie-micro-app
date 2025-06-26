<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    :inline-collapsed="isCollapsed"
    theme="dark"
  >
    <a-menu-item key="home" @click="handleMenuClick('/home')">
      <template #icon>
        <home-outlined />
      </template>
      <span>首页</span>
    </a-menu-item>

    <!-- 用户中心子应用 -->
    <a-sub-menu key="user">
      <template #icon>
        <user-outlined />
      </template>
      <template #title>用户中心</template>
      <a-menu-item key="user-list" @click="handleMenuClick('/user-center/list')">
        <span>用户管理</span>
      </a-menu-item>
      <a-menu-item key="user-role" @click="handleMenuClick('/user-center/role')">
        <span>角色管理</span>
      </a-menu-item>
      <a-menu-item key="user-permission" @click="handleMenuClick('/user-center/permission')">
        <span>权限配置</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 商品管理子应用 -->
    <a-sub-menu key="product">
      <template #icon>
        <shopping-outlined />
      </template>
      <template #title>商品管理</template>
      <a-menu-item key="product-list" @click="handleMenuClick('/product/list')">
        <span>商品列表</span>
      </a-menu-item>
      <a-menu-item key="product-category" @click="handleMenuClick('/product/category')">
        <span>分类管理</span>
      </a-menu-item>
      <a-menu-item key="product-brand" @click="handleMenuClick('/product/brand')">
        <span>品牌管理</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 订单系统子应用 -->
    <a-sub-menu key="order">
      <template #icon>
        <file-text-outlined />
      </template>
      <template #title>订单系统</template>
      <a-menu-item key="order-list" @click="handleMenuClick('/order/list')">
        <span>订单列表</span>
      </a-menu-item>
      <a-menu-item key="order-delivery" @click="handleMenuClick('/order/delivery')">
        <span>发货管理</span>
      </a-menu-item>
      <a-menu-item key="order-return" @click="handleMenuClick('/order/return')">
        <span>退货管理</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 数据分析子应用 -->
    <a-sub-menu key="analytics">
      <template #icon>
        <area-chart-outlined />
      </template>
      <template #title>数据分析</template>
      <a-menu-item key="analytics-dashboard" @click="handleMenuClick('/analytics/dashboard')">
        <span>数据看板</span>
      </a-menu-item>
      <a-menu-item key="analytics-sales" @click="handleMenuClick('/analytics/sales')">
        <span>销售分析</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 营销活动子应用 -->
    <a-sub-menu key="marketing">
      <template #icon>
        <gift-outlined />
      </template>
      <template #title>营销活动</template>
      <a-menu-item key="marketing-promotion" @click="handleMenuClick('/marketing/promotion')">
        <span>促销活动</span>
      </a-menu-item>
      <a-menu-item key="marketing-coupon" @click="handleMenuClick('/marketing/coupon')">
        <span>优惠券</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 库存管理子应用 -->
    <a-sub-menu key="inventory">
      <template #icon>
        <inbox-outlined />
      </template>
      <template #title>库存管理</template>
      <a-menu-item key="inventory-list" @click="handleMenuClick('/inventory/list')">
        <span>库存查询</span>
      </a-menu-item>
      <a-menu-item key="inventory-in" @click="handleMenuClick('/inventory/in')">
        <span>入库管理</span>
      </a-menu-item>
      <a-menu-item key="inventory-out" @click="handleMenuClick('/inventory/out')">
        <span>出库管理</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 系统设置子应用 -->
    <a-sub-menu key="settings">
      <template #icon>
        <setting-outlined />
      </template>
      <template #title>系统设置</template>
      <a-menu-item key="settings-config" @click="handleMenuClick('/settings/config')">
        <span>系统配置</span>
      </a-menu-item>
      <a-menu-item key="settings-logs" @click="handleMenuClick('/settings/logs')">
        <span>系统日志</span>
      </a-menu-item>
    </a-sub-menu>
  </a-menu>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  HomeOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  GiftOutlined,
  InboxOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
import { useGlobalStore } from '../store';

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();

// 菜单相关状态
const selectedKeys = ref<string[]>([]);
const openKeys = ref<string[]>([]);
const isCollapsed = computed(() => globalStore.isCollapsed);

// 处理菜单点击
const handleMenuClick = (path: string) => {
  router.push(path);
};

// 根据当前路由设置菜单选中状态
const updateMenuState = () => {
  const path = route.path;
  
  // 设置选中菜单项
  if (path === '/' || path === '/home') {
    selectedKeys.value = ['home'];
    openKeys.value = [];
    return;
  }
  
  // 处理子应用路由
  const pathParts = path.split('/').filter(Boolean);
  if (pathParts.length > 0) {
    const appName = pathParts[0];
    const subPath = pathParts.length > 1 ? pathParts[1] : '';
    
    // 设置展开的菜单
    openKeys.value = [appName];
    
    // 设置选中的菜单项
    if (subPath) {
      selectedKeys.value = [`${appName}-${subPath}`];
    } else {
      selectedKeys.value = [`${appName}-list`]; // 默认选中列表页
    }
  }
};

// 监听路由变化，更新菜单状态
watch(() => route.path, updateMenuState, { immediate: true });

// 监听折叠状态变化
watch(isCollapsed, (val) => {
  if (val) {
    openKeys.value = []; // 折叠时关闭所有展开的菜单
  }
});
</script>

<style scoped>
:deep(.ant-menu-item), :deep(.ant-menu-submenu-title) {
  display: flex;
  align-items: center;
}
</style> 