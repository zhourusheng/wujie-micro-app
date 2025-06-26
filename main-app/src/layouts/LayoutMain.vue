<template>
  <a-layout class="layout-container">
    <!-- 侧边导航 -->
    <a-layout-sider
      v-model:collapsed="isCollapsed"
      collapsible
      :width="256"
      class="layout-sider"
    >
      <div class="logo">
        <img src="../assets/logo.svg" alt="logo" />
        <h1 v-if="!isCollapsed">微前端平台</h1>
      </div>
      <app-menu />
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout>
      <!-- 顶部导航 -->
      <a-layout-header class="layout-header">
        <app-header @toggle-collapsed="toggleCollapsed" :collapsed="isCollapsed" />
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </a-layout-content>

      <!-- 页脚 -->
      <a-layout-footer class="layout-footer">
        微前端示例项目 ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import AppMenu from '../components/AppMenu.vue';
import AppHeader from '../components/AppHeader.vue';
import { useGlobalStore } from '../store';

// 从 store 获取侧边栏折叠状态
const globalStore = useGlobalStore();
const isCollapsed = ref(globalStore.isCollapsed);

// 切换侧边栏折叠状态
const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
  globalStore.toggleCollapse();
};
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.layout-sider {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  z-index: 10;
}

.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  background: #001529;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo h1 {
  color: white;
  font-size: 18px;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}

.layout-header {
  background: #fff;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  height: 64px;
  line-height: 64px;
  z-index: 9;
}

.layout-content {
  padding: 16px;
  margin: 16px;
  background: #fff;
  overflow: auto;
}

.layout-footer {
  text-align: center;
  padding: 16px 50px;
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