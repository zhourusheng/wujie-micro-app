<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    theme="dark"
  >
    <a-menu-item key="home" @click="handleMenuClick('/home')">
      <template #icon>
        <home-outlined />
      </template>
      <span>首页</span>
    </a-menu-item>

    <!-- 用户中心子应用 -->
    <a-sub-menu key="user-center">
      <template #icon>
        <user-outlined />
      </template>
      <template #title>用户中心</template>
      <a-menu-item key="user-center-list" @click="handleMenuClick('/user-center/list')">
        <span>用户管理</span>
      </a-menu-item>
      <a-menu-item key="user-center-role" @click="handleMenuClick('/user-center/role')">
        <span>角色管理</span>
      </a-menu-item>
      <a-menu-item key="user-center-permission" @click="handleMenuClick('/user-center/permission')">
        <span>权限配置</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 商品管理子应用 -->
    <a-sub-menu key="product-management">
      <template #icon>
        <shopping-outlined />
      </template>
      <template #title>商品管理</template>
      <a-menu-item key="product-management-list" @click="handleMenuClick('/product-management/list')">
        <span>商品列表</span>
      </a-menu-item>
      <a-menu-item key="product-management-category" @click="handleMenuClick('/product-management/category')">
        <span>分类管理</span>
      </a-menu-item>
      <a-menu-item key="product-management-brand" @click="handleMenuClick('/product-management/brand')">
        <span>品牌管理</span>
      </a-menu-item>
    </a-sub-menu>

    <!-- 订单系统子应用 -->
    <a-sub-menu key="order-system">
      <template #icon>
        <file-text-outlined />
      </template>
      <template #title>订单系统</template>
      <a-menu-item key="order-system-list" @click="handleMenuClick('/order-system/list')">
        <span>订单列表</span>
      </a-menu-item>
      <a-menu-item key="order-system-delivery" @click="handleMenuClick('/order-system/delivery')">
        <span>发票管理</span>
      </a-menu-item>
      <a-menu-item key="order-system-return" @click="handleMenuClick('/order-system/return')">
        <span>退货管理</span>
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
  FileTextOutlined
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
    let appName = pathParts[0];
    const subPath = pathParts.length > 1 ? pathParts[1] : '';
    
    // 根据路径前缀映射到对应的子应用key
    if (appName === 'product') {
      appName = 'product-management';
    } else if (appName === 'order') {
      appName = 'order-system';
    }
    
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
watch(isCollapsed, function(val: boolean) {
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