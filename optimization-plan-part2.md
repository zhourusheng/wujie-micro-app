# 无界微前端架构优化方案 - 第二部分

## 3. 公共依赖提取

### 3.1 共享工具库

创建`shared/utils`包，包含常用工具函数：

```typescript
// shared/utils/package.json
{
  "name": "@wujie-micro/utils",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "dependencies": {
    "dayjs": "^1.11.10",
    "lodash-es": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash-es": "^4.17.12",
    "tsup": "^8.0.1",
    "typescript": "^5.2.2"
  }
}
```

实现常用工具函数：

```typescript
// shared/utils/src/index.ts
export * from './date';
export * from './storage';
export * from './format';
export * from './validation';
```

### 3.2 共享API客户端

创建`shared/api-client`包，封装统一的API请求库：

```typescript
// shared/api-client/package.json
{
  "name": "@wujie-micro/api-client",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "dependencies": {
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "^5.2.2"
  }
}
```

封装请求库：

```typescript
// shared/api-client/src/index.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 如果是下载文件直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    // 自定义状态码检查
    if (res.code !== 200) {
      // 处理特定错误码
      if (res.code === 401) {
        // 如果是在wujie环境中，通过事件总线通知基座应用退出登录
        if (window.__POWERED_BY_WUJIE__ && window.$wujie?.bus) {
          window.$wujie.bus.$emit('logout', { from: 'api-client' });
        } else {
          // 独立运行时重定向到登录页
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(new Error(res.message || 'Error'));
    }
    
    return res.data;
  },
  (error) => {
    // 在wujie环境中，通知基座应用显示错误
    if (window.__POWERED_BY_WUJIE__ && window.$wujie?.bus) {
      window.$wujie.bus.$emit('error', { 
        message: error.message,
        from: 'api-client'
      });
    }
    
    return Promise.reject(error);
  }
);

export default axios;
export * from './types';
export * from './mock';
```

### 3.3 共享组件库

升级`shared/components`包，实现跨框架组件：

```typescript
// shared/components/package.json
{
  "name": "@wujie-micro/components",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "^5.2.2"
  }
}
```

实现跨框架组件：

```typescript
// shared/components/src/index.ts
export * from './vue';
export * from './react';
export * from './web-components';
```

### 3.4 共享类型定义

创建`shared/types`包，包含所有应用共享的类型定义：

```typescript
// shared/types/package.json
{
  "name": "@wujie-micro/types",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "^5.2.2"
  }
}
```

定义共享类型：

```typescript
// shared/types/src/index.ts
export * from './user';
export * from './product';
export * from './order';
export * from './common';
export * from './events';
``` 