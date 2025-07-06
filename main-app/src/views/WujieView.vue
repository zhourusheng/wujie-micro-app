<template>
  <div class="wujie-container">
    <WujieVue
      v-if="subAppName"
      width="100%"
      height="100%"
      :name="subAppName"
      :url="subAppUrl"
      :sync="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import WujieVue from "wujie-vue3";

const route = useRoute();

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

onMounted(() => {
  console.log(`子应用 ${subAppName.value} 挂载，路径: ${subPath.value}`);
});
</script>

<style scoped>
.wujie-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style> 