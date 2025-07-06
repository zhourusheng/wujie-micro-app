# wujie-micro-app

基于 wujie 的微前端应用架构实现

## 项目结构

```
wujie-micro-app
├── main-app               # 基座应用（Vue3 + TS）
├── sub-apps               # 子应用
│   ├── user-center        # 用户中心子应用（Vue3 + TS）
│   ├── product-management # 商品管理子应用（React18 + TS）
│   └── order-system       # 订单系统子应用（Vue2 + JS）
└── shared                 # 共享资源
```

## 技术栈

- **基座应用**：Vue3 + TypeScript + Vite + Pinia + Ant Design Vue
- **子应用**：
  - 用户中心：Vue3 + TypeScript + Vite + Pinia
  - 商品管理：React18 + TypeScript + Vite
  - 订单系统：Vue2 + JavaScript + Element UI
- **微前端框架**：无界 wujie
- **构建工具**：Vite / Vue-CLI
- **包管理工具**：pnpm，采用 Monorepo 管理模式

## 快速开始

### 安装依赖

```bash
# 安装 pnpm（如果未安装）
npm install -g pnpm

# 安装项目所有依赖
pnpm install:all
```

### 启动项目

```bash
# 启动基座应用
pnpm dev

# 启动用户中心子应用
pnpm dev:user

# 启动商品管理子应用
pnpm dev:product

# 启动订单系统子应用
pnpm dev:order
```

**注意:** 要完整测试微前端功能，需要同时启动基座应用和至少一个子应用。

### 开发模式访问地址

- 基座应用：http://localhost:8000
- 用户中心子应用：http://localhost:8001
- 商品管理子应用：http://localhost:8002
- 订单系统子应用：http://localhost:8003

## 用户中心子应用

用户中心子应用是一个基于 Vue3 和 TypeScript 开发的子应用，主要功能包括：

- 用户管理
- 权限配置
- 角色设定
- 行为审计
- 登录日志
- 操作历史

通过微前端架构，用户中心子应用可以作为独立应用运行，也可以被基座应用加载。

### 独立运行方式

```bash
# 进入用户中心目录
cd sub-apps/user-center

# 安装依赖（如果已执行过 pnpm install:all 则不需要）
pnpm install

# 启动开发服务器
pnpm dev
```

### 作为子应用加载

1. 启动用户中心子应用：`pnpm dev:user`
2. 启动基座应用：`pnpm dev`
3. 在基座应用中通过菜单导航到用户中心

## 商品管理子应用

商品管理子应用是一个基于 React18 和 TypeScript 开发的子应用，主要功能包括：

- 商品信息管理
- SKU管理
- 类目管理
- 商品上下架
- 批量导入导出
- 图片管理

通过微前端架构，商品管理子应用可以作为独立应用运行，也可以被基座应用加载。

### 独立运行方式

```bash
# 进入商品管理目录
cd sub-apps/product-management

# 安装依赖（如果已执行过 pnpm install:all 则不需要）
pnpm install

# 启动开发服务器
pnpm dev
```

### 作为子应用加载

1. 启动商品管理子应用：`pnpm dev:product`
2. 启动基座应用：`pnpm dev`
3. 在基座应用中通过菜单导航到商品管理

## 订单系统子应用

订单系统子应用是一个基于 Vue2 和 Element UI 开发的子应用，主要功能包括：

- 订单列表管理
- 订单详情查看
- 退换货管理
- 发票管理
- 物流跟踪

通过微前端架构，订单系统子应用可以作为独立应用运行，也可以被基座应用加载。

### 独立运行方式

```bash
# 进入订单系统目录
cd sub-apps/order-system

# 安装依赖（如果已执行过 pnpm install:all 则不需要）
pnpm install

# 启动开发服务器
pnpm dev
```

### 作为子应用加载

1. 启动订单系统子应用：`pnpm dev:order`
2. 启动基座应用：`pnpm dev`
3. 在基座应用中通过菜单导航到订单系统

## 构建部署

```bash
# 构建所有应用
pnpm build:all

# 或者分别构建
pnpm -r --filter=./main-app run build
pnpm -r --filter=./sub-apps/user-center run build
pnpm -r --filter=./sub-apps/product-management run build
pnpm -r --filter=./sub-apps/order-system run build
```

## 通信方式

本项目使用 wujie 提供的通信机制，主要包括：

1. 基座向子应用传递数据：通过 props 传递
2. 子应用向基座传递数据：通过 props 中的回调函数或事件总线
3. 子应用间通信：通过基座应用中转 

# Wujie 微前端项目改造指南

## 项目概述
这是一个基于 wujie 微前端框架的项目，包含主应用和多个子应用。本指南将帮助你将项目与官方示例保持一致。

## 主要改造点

### 1. WujieVue 的使用方式

官方示例在 Vue 项目中使用 WujieVue 的方式：
- Vue2 项目中使用 `wujie-vue2`
- Vue3 项目中使用 `wujie-vue3` 

#### 主应用配置
主应用中的关键配置：

```typescript
// 从 wujie-vue3 中导入 API
import WujieVue from 'wujie-vue3';
const { setupApp, preloadApp, bus } = WujieVue;

// 配置子应用
setupApp({
  name: "app-name",
  url: "//localhost:port/",
  attrs: {},
  exec: true,
  alive: true,  // 保活模式
  props: {},
  plugins: [], 
  degrade: false,  // 降级处理
  ...lifecycles,  // 生命周期
});

// 预加载
preloadApp({
  name: "app-name"
});
```

#### 子应用组件
在组件中使用 Wujie：

```vue
<template>
  <WujieVue width="100%" height="100%" name="app-name" :url="appUrl" :sync="true"></WujieVue>
</template>
```

### 2. 子应用路由同步

官方示例中，子应用路由变化时同步给主应用的方式：

```typescript
// 主应用设置监听
bus.$on("sub-route-change", (name, path) => {
  const mainName = `${name}-sub`;
  const mainPath = `/${name}-sub${path}`;
  // 更新主应用路由
  if (mainName === currentName && mainPath !== currentPath) {
    router.push({ path: mainPath });
  }
});

// 子应用触发路由变化
bus.$emit("sub-route-change", "app-name", "/path");
```

### 3. 保活与非保活模式

官方示例中对保活模式的处理：
- 保活模式下，name相同则复用一个子应用实例
- 改变URL无效，必须采用通信的方式告知路由变化
- 非保活模式下，直接通过URL传递路由信息

### 4. 预加载配置

官方示例中的预加载处理：
```typescript
if (window.localStorage.getItem("preload") !== "false") {
  preloadApp({ name: "app-name" });
}
```

### 5. 降级处理

官方示例中的降级处理判断：
```typescript
const degrade = window.localStorage.getItem("degrade") === "true" || !window.Proxy || !window.CustomElementRegistry;
```

### 实施建议

1. 按照官方示例模式重构 `wujie.ts` 配置文件
2. 简化 `WujieView.vue` 组件的实现
3. 统一通信和路由同步方式
4. 添加降级处理和预加载机制
5. 对每个子应用根据官方示例进行配置优化

## 项目改造完成情况

### 主应用改造
- ✅ 更新了 `wujie.ts` 配置文件，使用 `setupApp` 和 `preloadApp` API
- ✅ 简化了 `WujieView.vue` 组件实现
- ✅ 添加了降级处理机制
- ✅ 实现了与子应用的统一通信方式
- ✅ 优化了路由同步机制

### 子应用改造
- ✅ Vue3子应用（user-center）：使用选项式API实现通信
- ✅ React子应用（product-management）：使用路由包装组件实现通信
- ✅ Vue2子应用（order-system）：实现标准的路由同步机制
- ✅ 所有子应用都添加了独立运行模式下的导航菜单
- ✅ 统一了子应用与主应用的通信方式

### 通信机制
现在所有子应用都使用统一的通信方式：
- 子应用向主应用同步路由：`window.$wujie?.bus.$emit("sub-route-change", "子应用名称", 路径);`
- 主应用向子应用发送路由变更：`bus.$emit("子应用名称-router-change", 路径);`
- 子应用挂载成功通知：`window.$wujie?.bus.$emit("子应用名称-mounted", { timestamp: Date.now() });`

这种通信方式与官方示例保持一致，确保了子应用在不同框架下都能正确地与主应用进行通信和集成。 