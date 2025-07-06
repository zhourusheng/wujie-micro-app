<template>
  <div class="wujie-container">
    <WujieVue
      v-if="subAppName"
      :name="subAppName"
      :url="subAppUrl"
      :sync="true"
      :props="subAppProps"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import WujieVue from "wujie-vue3";
import { subApps, bus } from '../utils/wujie';
import { useGlobalStore } from '../store';

const route = useRoute();
const globalStore = useGlobalStore();

// 获取子应用名称
const subAppName = computed(() => {
  return route.meta.subApp as string;
});

// 获取子路径
const subPath = computed(() => {
  if (!route.params.pathMatch) return '/list';
  
  if (Array.isArray(route.params.pathMatch)) {
    return `/${route.params.pathMatch.join('/')}`;
  }
  
  return `/${route.params.pathMatch}`;
});

// 获取子应用URL
const subAppUrl = computed(() => {
  if (!subAppName.value || !subApps[subAppName.value]) return '';
  
  // 添加子路径到URL
  const baseUrl = subApps[subAppName.value].url;
  // 移除URL末尾的斜杠（如果有）
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}${subPath.value}`;
});

// 子应用props (传递给子应用的数据)
const subAppProps = computed(() => {
  return {
    // 传递路由信息
    routePath: subPath.value,
    routeQuery: route.query,
    routeParams: route.params,
    
    // 传递用户信息
    token: globalStore.token,
    userInfo: globalStore.userInfo,
    permissions: globalStore.permissions,
    
    // 传递通信方法
    sendToMain: (eventName: string, data: any) => {
      bus.$emit(eventName, data, subAppName.value);
    }
  };
});

// 监听路由变化，通知子应用
watch(() => route.fullPath, (newPath: string) => {
  // 发送路由变化事件给子应用
  if (subAppName.value) {
    bus.$emit(`${subAppName.value}:routeChange`, {
      path: subPath.value,
      query: route.query,
      params: route.params
    });
  }
});

// 挂载时的处理
onMounted(() => {
  console.log(`子应用 ${subAppName.value} 挂载，路径: ${subPath.value}`);
});

// 卸载时的处理
onUnmounted(() => {
  console.log(`子应用 ${subAppName.value} 卸载`);
});
</script>

<style scoped>
.wujie-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style> 