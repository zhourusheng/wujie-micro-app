<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="title">微前端统一认证中心</h2>
      
      <div class="form-item">
        <label for="username">用户名</label>
        <input 
          id="username" 
          v-model="form.username" 
          type="text" 
          placeholder="请输入用户名"
        />
      </div>
      
      <div class="form-item">
        <label for="password">密码</label>
        <input 
          id="password" 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码"
        />
      </div>
      
      <div class="form-item remember">
        <input 
          id="remember" 
          v-model="form.remember" 
          type="checkbox" 
        />
        <label for="remember">记住我</label>
      </div>
      
      <div class="form-actions">
        <button 
          class="login-button" 
          :disabled="loading" 
          @click="handleLogin"
        >
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth-store';
import { useGlobalStore } from '../store';

export default defineComponent({
  name: 'LoginView',
  
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const globalStore = useGlobalStore();
    
    // 表单数据
    const form = reactive({
      username: '',
      password: '',
      remember: false
    });
    
    // 加载状态
    const loading = ref(false);
    // 错误信息
    const errorMessage = ref('');
    
    // 处理登录
    const handleLogin = async () => {
      // 表单验证
      if (!form.username) {
        errorMessage.value = '请输入用户名';
        return;
      }
      
      if (!form.password) {
        errorMessage.value = '请输入密码';
        return;
      }
      
      // 开始登录
      loading.value = true;
      errorMessage.value = '';
      
      try {
        // 调用登录
        const success = await authStore.loginAction(form.username, form.password);
        
        if (success) {
          // 同步用户信息到全局状态
          if (authStore.userInfo) {
            globalStore.setUserInfo({
              userId: authStore.userInfo.id || '',
              username: authStore.userInfo.username,
              role: authStore.userInfo.isAdmin ? 'admin' : 'user',
              email: authStore.userInfo.email,
              avatar: authStore.userInfo.avatar
            });
            globalStore.setToken(authStore.token || '');
            globalStore.setPermissions(authStore.permissions || []);
          }
          
          // 登录成功，获取重定向地址（如果有）
          const redirectPath = route.query.redirect as string || '/';
          router.replace(redirectPath);
        } else {
          errorMessage.value = '登录失败，请检查用户名和密码';
        }
      } catch (error: any) {
        errorMessage.value = error.message || '登录失败，请稍后再试';
      } finally {
        loading.value = false;
      }
    };
    
    return {
      form,
      loading,
      errorMessage,
      handleLogin
    };
  }
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-color: #f0f2f5;
  background-image: url('../assets/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.login-form {
  width: 380px;
  padding: 40px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.form-item {
  margin-bottom: 24px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-item input[type="text"],
.form-item input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-item input:focus {
  outline: none;
  border-color: #1890ff;
}

.form-item.remember {
  display: flex;
  align-items: center;
}

.form-item.remember input {
  margin-right: 8px;
}

.form-actions {
  margin-top: 24px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #1890ff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #40a9ff;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  color: #ff4d4f;
  text-align: center;
}
</style> 