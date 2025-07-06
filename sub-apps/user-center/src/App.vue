<template>
  <div class="user-center-app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

// 声明 $wujie 类型
declare global {
  interface Window {
    $wujie?: {
      props: {
        sendToMain?: (eventName: string, data: any) => void;
        [key: string]: any;
      };
    };
  }
}

// 标记当前环境是否运行在微前端容器中
const isInWujie = ref(window.$wujie !== undefined);

// 获取从基座传递的数据
const injectProps = isInWujie.value ? window.$wujie?.props || {} : {};

onMounted(() => {
  console.log('用户中心子应用已挂载');
  console.log('从基座获取的props:', injectProps);
  
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