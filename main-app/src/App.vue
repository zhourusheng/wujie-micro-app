<template>
  <a-config-provider>
    <div class="app-container">
      <layout-main />
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import LayoutMain from './layouts/LayoutMain.vue';
import { setupWujie } from './utils/wujie';

onMounted(() => {
  // 初始化无界微前端
  setupWujie();
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app, .app-container {
  width: 100%;
  height: 100%;
}
</style> 