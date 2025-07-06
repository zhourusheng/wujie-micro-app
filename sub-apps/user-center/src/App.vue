<template>
  <div class="user-center-app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// 声明 $wujie 类型
declare global {
  interface Window {
    $wujie?: {
      props: {
        sendToMain?: (eventName: string, data: any) => void;
        routePath?: string;
        routeQuery?: Record<string, string>;
        routeParams?: Record<string, string>;
        [key: string]: any;
      };
    };
  }
}

const router = useRouter();

// 标记当前环境是否运行在微前端容器中
const isInWujie = ref(window.$wujie !== undefined);

// 获取从基座传递的数据
const injectProps = isInWujie.value ? window.$wujie?.props || {} : {};

// 处理主应用传递的路由
const handleRouteFromMain = () => {
  if (isInWujie.value && injectProps.routePath) {
    console.log('从主应用接收到路由:', injectProps.routePath);
    
    // 去掉开头的斜杠，因为子应用路由不需要
    const path = injectProps.routePath.startsWith('/') 
      ? injectProps.routePath 
      : `/${injectProps.routePath}`;
    
    // 如果当前路径与目标路径不同，则导航
    if (router.currentRoute.value.path !== path) {
      router.push({
        path: path,
        query: injectProps.routeQuery || {}
      }).catch(err => {
        console.error('路由跳转失败:', err);
      });
    }
  }
};

// 监听props变化
watch(() => window.$wujie?.props?.routePath, (newPath) => {
  if (newPath) {
    handleRouteFromMain();
  }
}, { immediate: true });

onMounted(() => {
  console.log('用户中心子应用已挂载');
  console.log('从基座获取的props:', injectProps);
  
  // 初始化时处理路由
  handleRouteFromMain();
  
  // 向基座发送消息
  if (injectProps.sendToMain && typeof injectProps.sendToMain === 'function') {
    injectProps.sendToMain('userCenter:mounted', { timestamp: Date.now() });
  }
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.user-center-app {
  height: 100%;
}
</style> 