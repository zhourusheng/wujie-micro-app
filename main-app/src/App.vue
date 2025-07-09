<template>
  <a-config-provider>
    <div class="app-container">
      <component :is="layout">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </component>
    </div>
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import LayoutMain from './layouts/LayoutMain.vue';
import LayoutBlank from './layouts/LayoutBlank.vue';

const route = useRoute();

// 根据路由元数据选择布局
const layout = computed(() => {
  // 根据路由meta.layout属性选择布局
  if (route.meta.layout === 'blank') {
    return LayoutBlank;
  }
  
  // 默认使用主布局
  return LayoutMain;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 