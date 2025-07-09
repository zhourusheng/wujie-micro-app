# 微前端统一认证中心设计方案

## 一、概述

本文档描述了基于 wujie 微前端架构的统一认证中心设计方案，实现 SSO 单点登录，统一管理用户身份与权限。该方案旨在确保主应用与子应用之间的无缝认证体验，实现"一次登录，处处可用"的效果。

## 二、系统架构

### 1. 整体架构

```
主应用 (Vue3 + TypeScript)
├── 认证中心模块
│   ├── 登录/注册页面
│   ├── 认证状态管理
│   └── 权限管理
└── 子应用容器
    ├── 用户中心子应用 (Vue3)
    ├── 商品管理子应用 (React18)
    └── 订单系统子应用 (Vue2)
```

### 2. 认证流程

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│   用户浏览器  │ ──── │   主应用    │ ──── │  认证服务API │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │
│ 子应用容器   │ ──── │   子应用    │ ──── │  共享状态   │
│             │      │             │      │             │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 三、认证中心核心功能

### 1. 统一登录与注册

- **登录页面**：在主应用中实现统一的登录页面
- **注册功能**：提供用户注册入口
- **第三方登录**：支持第三方账号登录（预留扩展）
- **记住登录状态**：支持"记住我"功能

### 2. 认证状态管理

- **Token管理**：使用JWT令牌进行身份验证
- **状态持久化**：将认证状态存储在localStorage中
- **状态共享**：通过Pinia全局状态管理，与子应用共享认证信息
- **自动续期**：Token即将过期时自动刷新

### 3. 权限控制

- **RBAC模型**：基于角色的访问控制
- **菜单权限**：根据用户权限动态生成菜单
- **按钮权限**：控制页面内按钮的显示与否
- **路由权限**：基于权限控制路由访问

## 四、技术实现方案

### 1. 主应用认证实现

#### 1.1 认证状态管理

使用Pinia管理全局认证状态：

```typescript
// auth-store.ts
import { defineStore } from 'pinia';
import { login, logout, refreshToken, getUserInfo } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userInfo: null,
    permissions: [],
    refreshTokenTimer: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permissionCode) => state.permissions.includes(permissionCode)
  },
  
  actions: {
    async loginAction(username, password) {
      try {
        // 调用登录API
        const response = await login(username, password);
        this.setToken(response.access_token);
        this.setUserInfo(response.user);
        
        // 设置token自动刷新
        this.setupTokenRefresh();
        return true;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },
    
    async logoutAction() {
      try {
        if (this.token) {
          await logout();
        }
      } finally {
        this.clearAuth();
      }
    },
    
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
      this.permissions = userInfo.permissions || [];
    },
    
    clearAuth() {
      this.token = null;
      this.userInfo = null;
      this.permissions = [];
      localStorage.removeItem('token');
      
      if (this.refreshTokenTimer) {
        clearTimeout(this.refreshTokenTimer);
        this.refreshTokenTimer = null;
      }
    },
    
    setupTokenRefresh() {
      // 假设token有效期为1小时，提前5分钟刷新
      const refreshTime = 55 * 60 * 1000;
      
      this.refreshTokenTimer = setTimeout(async () => {
        try {
          const response = await refreshToken();
          this.setToken(response.access_token);
          this.setupTokenRefresh();
        } catch (error) {
          console.error('刷新token失败:', error);
          // 刷新失败，可能需要重新登录
          this.clearAuth();
        }
      }, refreshTime);
    },
    
    async checkAuthState() {
      if (!this.token) return false;
      
      try {
        // 验证token有效性
        const response = await getUserInfo();
        this.setUserInfo(response);
        return true;
      } catch (error) {
        console.error('验证token失败:', error);
        this.clearAuth();
        return false;
      }
    }
  }
});
```

#### 1.2 API封装

```typescript
// api/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// 创建axios实例
const authApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
authApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 未授权，清除token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 登录
export function login(username, password) {
  return authApi.post('/auth/login', { username, password });
}

// 注册
export function register(userData) {
  return authApi.post('/auth/register', userData);
}

// 登出
export function logout() {
  return authApi.post('/auth/logout');
}

// 获取用户信息
export function getUserInfo() {
  return authApi.get('/auth/profile');
}

// 验证token
export function verifyToken(token) {
  return authApi.get(`/auth/verify-token?token=${token}`);
}

// 刷新token
export function refreshToken() {
  return authApi.post('/auth/refresh-token');
}
```

#### 1.3 路由守卫实现

```typescript
// router/guards.ts
import router from './index';
import { useAuthStore } from '../store/auth-store';

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login', '/register', '/forgot-password'];

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 设置页面标题
  document.title = `${to.meta.title || '未命名页面'} - 微前端平台`;
  
  // 已登录状态
  if (authStore.token) {
    // 如果访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      // 判断用户信息是否已获取
      if (!authStore.userInfo) {
        try {
          // 验证token并获取用户信息
          await authStore.checkAuthState();
          
          // 有用户信息后，放行
          next();
        } catch (error) {
          // token失效，重新登录
          authStore.clearAuth();
          next(`/login?redirect=${to.path}`);
        }
      } else {
        // 已有用户信息，检查页面权限
        if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
          next('/403'); // 无权限
        } else {
          next(); // 有权限，放行
        }
      }
    }
  } else {
    // 未登录状态
    if (whiteList.includes(to.path)) {
      // 白名单路由，直接放行
      next();
    } else {
      // 非白名单路由，重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});
```

### 2. 子应用认证集成

#### 2.1 主应用与子应用通信

修改wujie.ts配置，增加认证相关通信：

```typescript
// utils/wujie.ts
import WujieVue from "wujie-vue3";
import { useAuthStore } from '../store/auth-store';

// 设置全局通信
export function setupBus() {
  if (WujieVue && typeof WujieVue === 'object' && 'bus' in WujieVue) {
    const bus = WujieVue.bus;
    
    // 监听子应用请求token
    bus.$on("auth:getToken", (data, sender) => {
      console.log(`收到${sender}请求token消息:`, data);
      const authStore = useAuthStore();
      
      // 向子应用发送token和用户信息
      bus.$emit(`auth:setAuthInfo:${sender}`, { 
        token: authStore.token,
        userInfo: authStore.userInfo,
        permissions: authStore.permissions
      });
    });
    
    // 监听子应用请求登出
    bus.$on("auth:logout", () => {
      const authStore = useAuthStore();
      authStore.logoutAction();
      // 跳转到登录页
      window.location.href = '/login';
    });
    
    // 其他通信...
  }
}

// 初始化无界微前端
export function setupWujie() {
  // 设置全局通信
  setupBus();
  
  // 获取认证信息
  const authStore = useAuthStore();
  
  // 配置所有子应用
  if (WujieVue && typeof WujieVue === 'object' && 'setupApp' in WujieVue) {
    const setupApp = WujieVue.setupApp;
    
    Object.values(subApps).forEach(appConfig => {
      setupApp({
        ...appConfig,
        exec: appConfig.exec !== false,
        props: {
          ...defaultProps,
          // 注入认证信息到子应用
          token: authStore.token,
          userInfo: authStore.userInfo,
          permissions: authStore.permissions,
          ...(appConfig.props || {}),
        },
        degrade,
        ...lifecycles,
      });
    });
    
    // 预加载应用
    if (WujieVue && 'preloadApp' in WujieVue && window.localStorage.getItem("preload") !== "false") {
      const preloadApp = WujieVue.preloadApp;
      Object.keys(subApps).forEach(name => {
        preloadApp({
          name,
        });
      });
    }
  }
}
```

#### 2.2 子应用认证状态管理

以用户中心子应用为例：

```typescript
// store/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    userInfo: null,
    permissions: [],
    isMainApp: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasPermission: (state) => (permissionCode) => state.permissions.includes(permissionCode)
  },
  
  actions: {
    // 初始化认证状态
    initAuth() {
      // 判断是否在主应用中运行
      this.isMainApp = window.$wujie && !!window.$wujie.props;
      
      if (this.isMainApp) {
        // 在主应用中运行，从props获取认证信息
        const { token, userInfo, permissions } = window.$wujie.props;
        this.setAuthInfo(token, userInfo, permissions);
        
        // 监听认证信息更新
        if (window.wujie?.bus) {
          window.wujie.bus.$on(`auth:setAuthInfo:${window.__WUJIE.id}`, (data) => {
            this.setAuthInfo(data.token, data.userInfo, data.permissions);
          });
        }
      } else {
        // 独立运行时，从本地存储获取认证信息
        const token = localStorage.getItem('token');
        if (token) {
          this.token = token;
          // 从API获取用户信息
          this.fetchUserInfo();
        }
      }
    },
    
    // 设置认证信息
    setAuthInfo(token, userInfo, permissions) {
      this.token = token;
      this.userInfo = userInfo;
      this.permissions = permissions || [];
      
      // 独立运行时保存到本地存储
      if (!this.isMainApp && token) {
        localStorage.setItem('token', token);
      }
    },
    
    // 从API获取用户信息
    async fetchUserInfo() {
      if (!this.token) return;
      
      try {
        // 调用API获取用户信息
        const userInfo = await fetch('http://localhost:3001/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        }).then(res => res.json());
        
        this.userInfo = userInfo;
        this.permissions = userInfo.permissions || [];
      } catch (error) {
        console.error('获取用户信息失败:', error);
        this.clearAuth();
      }
    },
    
    // 清除认证信息
    clearAuth() {
      this.token = null;
      this.userInfo = null;
      this.permissions = [];
      
      if (!this.isMainApp) {
        localStorage.removeItem('token');
      }
    },
    
    // 登出
    logout() {
      if (this.isMainApp && window.wujie?.bus) {
        // 通知主应用登出
        window.wujie.bus.$emit('auth:logout');
      } else {
        // 独立运行时直接清除认证信息
        this.clearAuth();
        // 跳转到登录页
        window.location.href = '/login';
      }
    }
  }
});
```

#### 2.3 子应用路由守卫

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';

// 路由配置
const routes = [
  // 路由配置...
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 初始化认证状态
  if (!authStore.token) {
    await authStore.initAuth();
  }
  
  // 判断是否在主应用中运行
  const isInMainApp = window.$wujie && !!window.$wujie.props;
  
  if (isInMainApp) {
    // 在主应用中运行，已经通过主应用认证，直接放行
    if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
      next('/403'); // 无权限
    } else {
      next(); // 有权限，放行
    }
    
    // 通知主应用路由变化
    if (window.wujie?.bus) {
      window.wujie.bus.$emit('sub-route-change', window.__WUJIE.id, to.path);
    }
  } else {
    // 独立运行时，需要验证登录状态
    if (authStore.token) {
      if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
        next('/403'); // 无权限
      } else {
        next(); // 有权限，放行
      }
    } else {
      // 未登录，跳转到登录页
      next('/login');
    }
  }
});

export default router;
```

#### 2.4 子应用初始化认证

在子应用的main.ts中初始化认证：

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from './store/auth';

// 创建Vue应用实例
function createVueApp() {
  // 创建Pinia实例
  const pinia = createPinia();
  
  // 创建Vue应用
  const app = createApp(App);
  
  // 注册插件
  app.use(pinia);
  app.use(router);
  
  // 初始化认证状态
  const authStore = useAuthStore(pinia);
  authStore.initAuth();
  
  return app;
}

// 子应用挂载
if (window.__WUJIE_MOUNT) {
  window.__WUJIE_MOUNT = () => {
    createVueApp().mount('#app');
  };
} else {
  // 独立运行时直接挂载
  createVueApp().mount('#app');
}
```

## 五、安全性考虑

### 1. Token安全

- **HTTPS传输**：所有API请求必须使用HTTPS
- **Token存储**：使用localStorage存储，防止CSRF攻击
- **Token有效期**：设置合理的过期时间，并实现自动刷新机制
- **敏感操作二次验证**：对敏感操作要求二次验证

### 2. 子应用安全

- **子应用隔离**：利用wujie的沙箱机制确保子应用间的隔离
- **CSP策略**：实施内容安全策略，限制资源加载
- **最小权限原则**：子应用只能访问必要的API和数据
- **输入验证**：所有用户输入必须经过验证和消毒

## 六、实施步骤

### 1. 主应用实施

1. 创建认证相关组件和页面
   - 登录页面
   - 注册页面
   - 用户信息页面
   - 权限管理页面

2. 实现认证状态管理
   - 创建auth-store
   - 实现API调用封装
   - 配置路由守卫

3. 集成wujie通信机制
   - 配置认证信息传递
   - 实现子应用通信

### 2. 子应用适配

1. 实现子应用认证状态管理
   - 创建auth-store
   - 添加主应用通信逻辑

2. 配置子应用路由守卫
   - 实现权限控制
   - 配置路由同步

3. 调整子应用UI
   - 隐藏独立登录入口
   - 适配权限控制

## 七、测试计划

1. **单元测试**
   - 认证状态管理测试
   - API调用测试
   - 路由守卫测试

2. **集成测试**
   - 主应用与子应用通信测试
   - 子应用间状态同步测试

3. **端到端测试**
   - 登录流程测试
   - 权限控制测试
   - 子应用加载测试

## 八、总结

本方案通过在主应用中实现统一的认证中心，并利用wujie微前端框架的通信机制，实现了子应用的无缝认证集成。主要特点包括：

1. **统一登录入口**：用户只需在主应用登录一次
2. **状态共享**：认证状态在主应用和子应用间共享
3. **权限控制**：统一的权限管理和控制
4. **安全可靠**：采用JWT令牌和安全存储机制
5. **兼容独立运行**：子应用支持独立运行模式

通过这种方式，既保证了良好的用户体验，又维护了系统的安全性和可维护性。 