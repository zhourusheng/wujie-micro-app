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