<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <a-button type="primary" @click="goHome">返回首页</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.content {
  padding: 48px;
}

h1 {
  font-size: 72px;
  color: #1890ff;
  margin-bottom: 24px;
}

h2 {
  font-size: 24px;
  margin-bottom: 16px;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}
</style> 