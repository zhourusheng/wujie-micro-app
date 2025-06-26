<template>
  <div class="app-header">
    <div class="header-left">
      <!-- 折叠按钮 -->
      <menu-unfold-outlined
        v-if="collapsed"
        class="trigger"
        @click="$emit('toggle-collapsed')"
      />
      <menu-fold-outlined
        v-else
        class="trigger"
        @click="$emit('toggle-collapsed')"
      />
    </div>

    <div class="header-right">
      <!-- 全屏按钮 -->
      <a-tooltip placement="bottom">
        <template #title>全屏</template>
        <a-button type="text" class="header-icon">
          <template #icon><fullscreen-outlined /></template>
        </a-button>
      </a-tooltip>

      <!-- 通知按钮 -->
      <a-dropdown>
        <a-badge count="5">
          <a-button type="text" class="header-icon">
            <template #icon><bell-outlined /></template>
          </a-button>
        </a-badge>
        <template #overlay>
          <a-menu>
            <a-menu-item>
              <notification-outlined /> 系统通知 (3)
            </a-menu-item>
            <a-menu-item>
              <message-outlined /> 未读消息 (2)
            </a-menu-item>
            <a-menu-item>
              <setting-outlined /> 通知设置
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- 用户头像和下拉菜单 -->
      <a-dropdown>
        <div class="user-dropdown">
          <a-avatar :src="userAvatar" />
          <span class="username">{{ userName }}</span>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">
              <template #icon><user-outlined /></template>
              个人中心
            </a-menu-item>
            <a-menu-item key="settings">
              <template #icon><setting-outlined /></template>
              个人设置
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <template #icon><logout-outlined /></template>
              退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { 
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  FullscreenOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  NotificationOutlined,
  MessageOutlined
} from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../store';
import { message } from 'ant-design-vue';

// 定义props
defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
});

// 定义事件
defineEmits(['toggle-collapsed']);

const router = useRouter();
const globalStore = useGlobalStore();

// 获取用户名和头像
const userName = computed(() => globalStore.userName);
const userAvatar = computed(() => globalStore.userInfo?.avatar || '');

// 退出登录
const handleLogout = () => {
  globalStore.logout();
  message.success('已退出登录');
  router.push('/login');
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 100%;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-icon {
  font-size: 16px;
  padding: 0 12px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0 12px;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}
</style> 