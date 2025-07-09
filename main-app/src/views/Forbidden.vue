<template>
  <div class="forbidden-container">
    <div class="content">
      <h1>403</h1>
      <h2>禁止访问</h2>
      <p>抱歉，您没有权限访问此页面</p>
      <button @click="goHome" class="go-home-button">返回首页</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ForbiddenView',
  
  setup() {
    const router = useRouter();
    
    const goHome = () => {
      router.push('/');
    };
    
    return {
      goHome
    };
  }
});
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.content {
  text-align: center;
  padding: 48px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

h1 {
  font-size: 72px;
  font-weight: bold;
  color: #ff4d4f;
  margin: 0;
  line-height: 1.2;
}

h2 {
  font-size: 28px;
  color: #333;
  margin-top: 12px;
  margin-bottom: 24px;
}

p {
  font-size: 18px;
  color: #666;
  margin-bottom: 32px;
}

.go-home-button {
  padding: 10px 24px;
  background-color: #1890ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.go-home-button:hover {
  background-color: #40a9ff;
}
</style> 