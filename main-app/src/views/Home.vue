<template>
  <div class="home-container">
    <div class="welcome-section">
      <h1>欢迎使用微前端电商管理平台</h1>
      <p>基于无界(wujie)微前端框架构建的企业级电商管理系统</p>
    </div>

    <a-row :gutter="[16, 16]" class="app-cards">
      <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="app in appList" :key="app.name">
        <a-card hoverable @click="navigateToApp(app.path)">
          <template #cover>
            <div class="card-icon" :style="{ background: app.bgColor }">
              <component :is="app.icon" class="app-icon" />
            </div>
          </template>
          <a-card-meta :title="app.title">
            <template #description>{{ app.description }}</template>
          </a-card-meta>
          <div class="card-footer">
            <a-button type="primary">进入应用</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <div class="dashboard-section">
      <h2>平台概览</h2>
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="总订单数" :value="5768" :value-style="{ color: '#3f8600' }" class="stat-card">
            <template #prefix>
              <shopping-cart-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="新增用户" :value="328" :value-style="{ color: '#1890ff' }" class="stat-card">
            <template #prefix>
              <user-add-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="商品总数" :value="1254" :value-style="{ color: '#722ed1' }" class="stat-card">
            <template #prefix>
              <shopping-outlined />
            </template>
          </a-statistic>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-statistic title="系统消息" :value="12" :value-style="{ color: '#cf1322' }" class="stat-card">
            <template #prefix>
              <notification-outlined />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { 
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  AreaChartOutlined,
  GiftOutlined,
  InboxOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  UserAddOutlined,
  NotificationOutlined
} from '@ant-design/icons-vue';

const router = useRouter();

// 子应用列表
const appList = reactive([
  { 
    name: 'user-center', 
    title: '用户中心', 
    path: '/user-center', 
    icon: UserOutlined, 
    bgColor: '#1890ff',
    description: '用户管理、权限控制、角色分配' 
  },
  { 
    name: 'product-management', 
    title: '商品管理', 
    path: '/product', 
    icon: ShoppingOutlined, 
    bgColor: '#52c41a',
    description: '商品信息、库存、分类管理' 
  },
  { 
    name: 'order-system', 
    title: '订单系统', 
    path: '/order', 
    icon: FileTextOutlined, 
    bgColor: '#fa8c16',
    description: '订单处理、物流跟踪、售后处理' 
  },
  { 
    name: 'data-analytics', 
    title: '数据分析', 
    path: '/analytics', 
    icon: AreaChartOutlined, 
    bgColor: '#722ed1',
    description: '数据报表、趋势分析、用户行为'
  },
  { 
    name: 'marketing', 
    title: '营销活动', 
    path: '/marketing', 
    icon: GiftOutlined, 
    bgColor: '#eb2f96',
    description: '营销策划、优惠券、促销管理'
  },
  { 
    name: 'inventory', 
    title: '库存管理', 
    path: '/inventory', 
    icon: InboxOutlined, 
    bgColor: '#13c2c2',
    description: '库存监控、供应链、采购管理'
  },
  { 
    name: 'settings', 
    title: '系统设置', 
    path: '/settings', 
    icon: SettingOutlined, 
    bgColor: '#faad14',
    description: '系统参数配置、日志、备份'
  }
]);

// 跳转到子应用
const navigateToApp = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.home-container {
  padding: 24px;
  background-color: #f0f2f5;
  border-radius: 2px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.welcome-section h1 {
  font-size: 28px;
  margin-bottom: 16px;
  color: #262626;
}

.welcome-section p {
  font-size: 16px;
  color: #595959;
}

.app-cards {
  margin-bottom: 40px;
}

.card-icon {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-icon {
  font-size: 48px;
  color: #fff;
}

.card-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.dashboard-section {
  background-color: #fff;
  padding: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dashboard-section h2 {
  margin-bottom: 24px;
  font-size: 20px;
  color: #262626;
}

.stat-card {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}
</style> 