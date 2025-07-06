# 无界微前端架构优化方案 - 第三部分

## 4. 构建优化

### 4.1 共享构建配置

创建`shared/build-config`包，统一构建配置：

```typescript
// shared/build-config/package.json
{
  "name": "@wujie-micro/build-config",
  "version": "1.0.0",
  "main": "index.js",
  "files": [
    "eslint",
    "typescript",
    "vite",
    "jest"
  ],
  "dependencies": {
    "eslint": "^8.44.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.10"
  }
}
```

提供统一的ESLint配置：

```javascript
// shared/build-config/eslint/index.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    // 统一的ESLint规则
  }
};
```

提供统一的Vite配置：

```javascript
// shared/build-config/vite/index.js
const path = require('path');

module.exports = {
  createConfig: ({ mode, command, isMicroApp = false }) => {
    return {
      // 基础配置
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), 'src')
        }
      },
      // 微前端特定配置
      server: {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      // 生产环境优化
      build: {
        sourcemap: mode === 'development',
        minify: mode === 'production',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['vue', 'react', 'react-dom'],
              ui: ['ant-design-vue', 'element-plus', 'antd']
            }
          }
        }
      }
    };
  }
};
```

### 4.2 模块联邦实现

为支持运行时共享依赖，在Vite项目中添加模块联邦：

```javascript
// main-app/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'main-app',
      filename: 'remoteEntry.js',
      exposes: {
        './utils': './src/utils/index.ts',
        './components': './src/components/index.ts'
      },
      shared: ['vue', 'pinia', 'ant-design-vue']
    })
  ]
});
```

在子应用中消费共享模块：

```javascript
// sub-apps/user-center/vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'user-center',
      filename: 'remoteEntry.js',
      remotes: {
        'main-app': 'http://localhost:8000/assets/remoteEntry.js'
      },
      shared: ['vue', 'pinia', 'ant-design-vue']
    })
  ]
});
```

## 5. 通信机制优化

### 5.1 类型安全的事件总线

创建`shared/event-bus`包，提供类型安全的事件总线：

```typescript
// shared/event-bus/package.json
{
  "name": "@wujie-micro/event-bus",
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

实现类型安全的事件总线：

```typescript
// shared/event-bus/src/index.ts
import { EventMap, EventName, EventPayload } from './types';

class TypedEventBus<Events extends EventMap> {
  private listeners: Partial<{
    [E in EventName<Events>]: Array<(payload: EventPayload<Events, E>) => void>;
  }> = {};

  $on<E extends EventName<Events>>(event: E, callback: (payload: EventPayload<Events, E>) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback as any);
  }

  $off<E extends EventName<Events>>(event: E, callback?: (payload: EventPayload<Events, E>) => void): void {
    if (!callback) {
      delete this.listeners[event];
      return;
    }
    
    const callbacks = this.listeners[event];
    if (callbacks) {
      this.listeners[event] = callbacks.filter(cb => cb !== callback) as any;
    }
  }

  $emit<E extends EventName<Events>>(event: E, payload: EventPayload<Events, E>): void {
    const callbacks = this.listeners[event];
    if (callbacks) {
      callbacks.forEach(callback => callback(payload));
    }
  }
}

export { TypedEventBus };
export * from './types';
```

定义事件类型：

```typescript
// shared/event-bus/src/types.ts
export interface EventMap {
  [key: string]: any;
}

export type EventName<T> = string & keyof T;
export type EventPayload<T, E extends EventName<T>> = T[E];

// 定义应用事件映射
export interface AppEvents {
  'sub-route-change': { name: string; path: string };
  'user-center-mounted': { timestamp: number };
  'product-management-mounted': { timestamp: number };
  'order-system-mounted': { timestamp: number };
  'user-center-router-change': string;
  'product-management-router-change': string;
  'order-system-router-change': string;
  'logout': { from: string };
  'error': { message: string; from: string };
}
```

### 5.2 状态共享机制

创建`shared/store`包，提供跨应用状态共享：

```typescript
// shared/store/package.json
{
  "name": "@wujie-micro/store",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts"
  },
  "dependencies": {
    "pinia": "^2.1.7",
    "pinia-plugin-persistedstate": "^3.2.0"
  },
  "devDependencies": {
    "tsup": "^8.0.1",
    "typescript": "^5.2.2"
  }
}
```

实现跨应用状态共享：

```typescript
// shared/store/src/index.ts
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

export function createSharedPinia() {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate);
  return pinia;
}

export * from './user';
export * from './app';
``` 