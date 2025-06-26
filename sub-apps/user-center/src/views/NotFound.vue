<template>
  <div class="not-found">
    <div class="not-found-content">
      <div class="not-found-image">
        <img src="https://cdn.jsdelivr.net/gh/apache/incubator-brpc-website@asf-site/img/404.svg" alt="404" />
      </div>
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>抱歉，您访问的页面不存在或已被删除</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
}

.not-found-image {
  margin-bottom: 20px;
}

.not-found-image img {
  width: 200px;
  height: auto;
}

h1 {
  font-size: 72px;
  color: #409eff;
  margin: 0;
  line-height: 1.2;
}

h2 {
  font-size: 24px;
  color: #303133;
  margin: 10px 0;
}

p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
}
</style> 