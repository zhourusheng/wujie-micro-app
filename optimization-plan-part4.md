# 无界微前端架构优化方案 - 第四部分

## 6. 开发体验优化

### 6.1 统一启动脚本

创建统一启动脚本：

```javascript
// scripts/dev.js
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 定义要启动的应用
const apps = [
  { name: 'main-app', port: 8000 },
  { name: 'user-center', port: 8001 },
  { name: 'product-management', port: 8002 },
  { name: 'order-system', port: 8003 }
];

// 启动所有应用
function startAllApps() {
  apps.forEach(app => {
    const appPath = app.name === 'main-app' 
      ? path.join(__dirname, '..', app.name)
      : path.join(__dirname, '..', 'sub-apps', app.name);
    
    // 检查应用目录是否存在
    if (!fs.existsSync(appPath)) {
      console.error(`应用目录不存在: ${appPath}`);
      return;
    }
    
    // 启动应用
    const child = spawn('pnpm', ['dev'], {
      cwd: appPath,
      stdio: 'pipe',
      shell: true
    });
    
    // 输出应用日志，添加应用名称前缀
    child.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.log(`[${app.name}] ${line}`);
        }
      });
    });
    
    child.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          console.error(`[${app.name}] ${line}`);
        }
      });
    });
    
    child.on('close', (code) => {
      console.log(`[${app.name}] 进程退出，退出码: ${code}`);
    });
    
    console.log(`已启动 ${app.name} 在端口 ${app.port}`);
  });
}

// 启动应用
startAllApps();
```

更新package.json脚本：

```json
{
  "scripts": {
    "dev:all": "node scripts/dev.js",
    "build:all": "node scripts/build.js"
  }
}
```

### 6.2 开发调试工具

创建微前端调试工具：

```typescript
// main-app/src/utils/debug.ts
import { bus } from './wujie';

// 开发环境下添加调试工具
if (process.env.NODE_ENV === 'development') {
  // 将事件总线暴露到全局
  window.__WUJIE_DEBUG__ = {
    bus,
    apps: {},
    events: []
  };
  
  // 监听所有事件
  const originalEmit = bus.$emit;
  bus.$emit = function(...args: any[]) {
    // 记录事件
    window.__WUJIE_DEBUG__.events.push({
      type: 'emit',
      event: args[0],
      payload: args[1],
      timestamp: Date.now()
    });
    
    // 调用原始方法
    return originalEmit.apply(this, args);
  };
  
  // 添加调试面板
  const debugPanel = document.createElement('div');
  debugPanel.id = 'wujie-debug-panel';
  debugPanel.style.cssText = `
    position: fixed;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 200px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 12px;
    padding: 10px;
    overflow: auto;
    z-index: 9999;
    display: none;
  `;
  
  document.body.appendChild(debugPanel);
  
  // 添加快捷键切换调试面板
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
      const panel = document.getElementById('wujie-debug-panel');
      if (panel) {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        
        if (panel.style.display === 'block') {
          // 更新调试面板内容
          panel.innerHTML = `
            <h3>Wujie Debug</h3>
            <p>最近事件:</p>
            <ul>
              ${window.__WUJIE_DEBUG__.events.slice(-5).map(e => 
                `<li>${new Date(e.timestamp).toISOString().substr(11, 8)} - ${e.event}: ${JSON.stringify(e.payload)}</li>`
              ).join('')}
            </ul>
          `;
        }
      }
    }
  });
}
```

## 7. 部署与CI/CD优化

### 7.1 Docker配置

创建Docker配置：

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

# 安装pnpm
RUN npm install -g pnpm@10.11.0

# 设置工作目录
WORKDIR /app

# 复制package.json和pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# 复制所有子包的package.json
COPY main-app/package.json ./main-app/
COPY sub-apps/user-center/package.json ./sub-apps/user-center/
COPY sub-apps/product-management/package.json ./sub-apps/product-management/
COPY sub-apps/order-system/package.json ./sub-apps/order-system/
COPY shared/components/package.json ./shared/components/
COPY shared/utils/package.json ./shared/utils/
COPY shared/api-client/package.json ./shared/api-client/
COPY shared/types/package.json ./shared/types/
COPY shared/event-bus/package.json ./shared/event-bus/
COPY shared/build-config/package.json ./shared/build-config/

# 安装依赖
RUN pnpm install

# 复制源代码
COPY . .

# 构建共享包
RUN pnpm --filter=@wujie-micro/* run build

# 构建所有应用
RUN pnpm build:all

# 生产环境镜像
FROM nginx:alpine

# 复制Nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /app/main-app/dist /usr/share/nginx/html
COPY --from=builder /app/sub-apps/user-center/dist /usr/share/nginx/html/8001
COPY --from=builder /app/sub-apps/product-management/dist /usr/share/nginx/html/8002
COPY --from=builder /app/sub-apps/order-system/dist /usr/share/nginx/html/8003

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

创建Nginx配置：

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;
    
    # 基座应用
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # 用户中心子应用
    location /8001/ {
        alias /usr/share/nginx/html/8001/;
        index index.html;
        try_files $uri $uri/ /8001/index.html;
        
        # CORS配置
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
    
    # 商品管理子应用
    location /8002/ {
        alias /usr/share/nginx/html/8002/;
        index index.html;
        try_files $uri $uri/ /8002/index.html;
        
        # CORS配置
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
    
    # 订单系统子应用
    location /8003/ {
        alias /usr/share/nginx/html/8003/;
        index index.html;
        try_files $uri $uri/ /8003/index.html;
        
        # CORS配置
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
    }
}
```

### 7.2 CI/CD配置

创建GitHub Actions配置：

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 10.11.0
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Build shared packages
      run: pnpm --filter=@wujie-micro/* run build
    
    - name: Build all applications
      run: pnpm build:all
    
    - name: Run tests
      run: pnpm test
    
    - name: Build Docker image
      if: github.ref == 'refs/heads/main'
      run: docker build -t wujie-micro-app:latest .
    
    - name: Deploy to production
      if: github.ref == 'refs/heads/main'
      run: |
        # 部署脚本
        echo "Deploying to production..."
```

## 8. 性能优化

### 8.1 预加载策略优化

优化`wujie.ts`中的预加载策略：

```typescript
// main-app/src/utils/wujie.ts

// 智能预加载策略
function setupPreloadStrategy() {
  // 基于用户行为预测
  const userPreferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');
  const frequentApps = userPreferences.frequentApps || ['user-center'];
  
  // 预加载频繁访问的应用
  if (window.localStorage.getItem("preload") !== "false") {
    frequentApps.forEach(appName => {
      if (subApps[appName]) {
        WujieVue.preloadApp({
          name: appName,
          url: subApps[appName].url,
        });
      }
    });
  }
  
  // 记录应用访问
  function recordAppVisit(appName: string) {
    const visits = JSON.parse(localStorage.getItem('appVisits') || '{}');
    visits[appName] = (visits[appName] || 0) + 1;
    localStorage.setItem('appVisits', JSON.stringify(visits));
    
    // 更新频繁访问的应用
    const sortedApps = Object.entries(visits)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .map(([name]) => name)
      .slice(0, 3);
    
    userPreferences.frequentApps = sortedApps;
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
  }
  
  // 监听路由变化，记录应用访问
  router.afterEach((to) => {
    const appName = to.meta.subApp as string;
    if (appName) {
      recordAppVisit(appName);
    }
  });
}

// 初始化无界微前端
export function setupWujie() {
  // 设置全局通信
  setupBus();
  
  // 配置所有子应用
  if (WujieVue && typeof WujieVue === 'object' && 'setupApp' in WujieVue) {
    const setupApp = WujieVue.setupApp;
    
    Object.values(subApps).forEach(appConfig => {
      setupApp({
        ...appConfig,
        exec: appConfig.exec !== false,
        props: {
          ...defaultProps,
          ...(appConfig.props || {}),
        },
        degrade,
        ...lifecycles,
      });
    });
    
    // 设置预加载策略
    setupPreloadStrategy();
  }
}
```

### 8.2 性能监控

添加性能监控工具：

```typescript
// main-app/src/utils/performance.ts
import { subApps } from './wujie';

// 性能指标类型
interface PerformanceMetrics {
  appName: string;
  loadTime: number;
  mountTime: number;
  firstPaint: number;
  firstContentfulPaint: number;
  ttfb: number;
  domInteractive: number;
  domComplete: number;
}

// 性能监控类
class PerformanceMonitor {
  private metrics: Record<string, PerformanceMetrics> = {};
  
  constructor() {
    this.setupListeners();
  }
  
  private setupListeners() {
    // 监听子应用生命周期
    Object.keys(subApps).forEach(appName => {
      // 记录加载开始时间
      const startTime = Date.now();
      
      // 监听挂载完成事件
      window.$wujie?.bus.$on(`${appName}-mounted`, () => {
        const mountTime = Date.now() - startTime;
        
        // 收集性能指标
        this.collectMetrics(appName, mountTime);
      });
    });
  }
  
  private collectMetrics(appName: string, mountTime: number) {
    // 获取导航性能指标
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // 获取绘制性能指标
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0;
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    
    // 记录性能指标
    this.metrics[appName] = {
      appName,
      loadTime: navigation.loadEventEnd - navigation.fetchStart,
      mountTime,
      firstPaint,
      firstContentfulPaint,
      ttfb: navigation.responseStart - navigation.requestStart,
      domInteractive: navigation.domInteractive - navigation.fetchStart,
      domComplete: navigation.domComplete - navigation.fetchStart
    };
    
    // 发送性能指标到分析服务
    this.sendMetrics(this.metrics[appName]);
    
    console.log(`[Performance] ${appName} metrics:`, this.metrics[appName]);
  }
  
  private sendMetrics(metrics: PerformanceMetrics) {
    // 实际项目中，可以将指标发送到分析服务
    // 例如使用 Beacon API 发送
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/analytics/performance', JSON.stringify(metrics));
    }
  }
  
  // 获取所有性能指标
  public getAllMetrics() {
    return this.metrics;
  }
  
  // 清除性能指标
  public clearMetrics() {
    this.metrics = {};
    performance.clearMarks();
    performance.clearMeasures();
    performance.clearResourceTimings();
  }
}

// 导出性能监控实例
export const performanceMonitor = new PerformanceMonitor();
```

## 9. 总结与后续计划

本优化方案从多个维度对微前端架构进行了全面优化，包括：

1. **架构优化**：重构目录结构，优化依赖管理
2. **公共依赖提取**：创建共享工具库、API客户端、组件库和类型定义
3. **构建优化**：统一构建配置，实现模块联邦
4. **通信机制优化**：类型安全的事件总线，跨应用状态共享
5. **开发体验优化**：统一启动脚本，开发调试工具
6. **部署与CI/CD优化**：Docker配置，GitHub Actions配置
7. **性能优化**：预加载策略优化，性能监控

### 后续计划

1. **完善文档**：为所有共享包编写详细文档和示例
2. **自动化测试**：添加单元测试和E2E测试
3. **微前端扩展**：支持更多子应用类型，如Angular、Svelte等
4. **性能优化**：进一步优化首屏加载时间和运行时性能
5. **安全加固**：增强跨应用通信的安全性 