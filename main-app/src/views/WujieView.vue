<template>
  <div class="wujie-container">
    <WujieVue
      v-if="subAppName && isLoggedIn"
      width="100%"
      height="100%"
      :name="subAppName"
      :url="subAppUrl"
      :sync="true"
    />
    <div v-else-if="!isLoggedIn" class="login-required">
      <div class="login-message">
        <h2>需要登录</h2>
        <p>请先登录后再访问此页面</p>
        <button @click="goToLogin" class="login-button">去登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WujieVue from "wujie-vue3";
import { useAuthStore } from '../store/auth-store';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// 判断用户是否已登录
const isLoggedIn = computed(() => authStore.isLoggedIn);

// 获取子应用名称
const subAppName = computed(() => {
  return route.meta.subApp as string;
});

// 获取子路径
const subPath = computed(() => {
  if (!route.params.pathMatch) return '/';
  
  if (Array.isArray(route.params.pathMatch)) {
    return `/${route.params.pathMatch.join('/')}`;
  }
  
  return `/${route.params.pathMatch}`;
});

// 获取子应用URL
const subAppUrl = computed(() => {
  if (!subAppName.value) return '';
  
  // 根据子应用名称获取基础URL
  const baseUrl = getBaseUrl(subAppName.value);
  if (!baseUrl) return '';
  
  // 移除URL末尾的斜杠（如果有）
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${subPath.value}`;
});

// 获取子应用基础URL
function getBaseUrl(name: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  switch (name) {
    case 'user-center':
      return isProduction ? `//${window.location.host}/8001/` : '//localhost:8001/';
    case 'product-management':
      return isProduction ? `//${window.location.host}/8002/` : '//localhost:8002/';
    case 'order-system':
      return isProduction ? `//${window.location.host}/8003/` : '//localhost:8003/';
    default:
      return '';
  }
}

// 监听路由变化，通知子应用
watch(() => route.fullPath, () => {
  // 发送路由变化事件给子应用
  if (subAppName.value && WujieVue && 'bus' in WujieVue) {
    WujieVue.bus.$emit(`${subAppName.value}-router-change`, subPath.value);
  }
});

// 跳转到登录页
function goToLogin() {
  router.push({
    path: '/login',
    query: { redirect: route.fullPath }
  });
}

onMounted(() => {
  console.log(`子应用 ${subAppName.value} 挂载，路径: ${subPath.value}`);
  
  // 如果用户未登录，自动跳转到登录页
  if (!isLoggedIn.value) {
    console.log('用户未登录，无法加载子应用');
    goToLogin();
  }
});
</script>

<style scoped>
.wujie-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.login-required {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-message {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-message h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 16px;
}

.login-message p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

.login-button {
  padding: 8px 24px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #40a9ff;
}
</style> 