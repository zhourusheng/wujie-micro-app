# Wujie 微前端应用

基于无界(wujie)微前端框架构建的企业级电商管理平台。

## 项目结构

```
wujie-micro-app
├── main-app             # 基座应用 (Vue3 + TypeScript + Vite + Pinia)
├── sub-apps             # 子应用目录
│   ├── user-center      # 用户中心子应用 (Vue3)
│   ├── product-management # 商品管理子应用 (React18)
│   └── order-system     # 订单系统子应用 (Vue2)
└── shared               # 共享资源
    └── components       # 共享组件
```

## 技术栈

- **基座应用**: Vue3 + TypeScript + Vite + Pinia
- **子应用**: 支持多框架（Vue3/Vue2/React/Angular等）
- **微前端框架**: 无界(wujie)
- **UI组件库**: Ant Design Vue/React
- **构建工具**: Vite/Webpack 5
- **包管理工具**: pnpm (Monorepo)

## 快速开始

### 安装依赖

```bash
# 安装所有依赖
pnpm install:all
```

### 开发模式

```bash
# 启动基座应用
pnpm dev

# 启动子应用（单独开发模式）
pnpm dev:user     # 启动用户中心子应用
pnpm dev:product  # 启动商品管理子应用
pnpm dev:order    # 启动订单系统子应用
```

### 构建

```bash
# 构建所有应用
pnpm build:all
```

## 应用通信

无界(wujie)提供了丰富的通信机制：

1. **基座向子应用通信**: 通过props传递
2. **子应用向基座通信**: 通过window.$wujie.bus.$emit触发事件
3. **子应用间通信**: 通过基座中转或直接使用window.$wujie.bus

## 子应用接入指南

1. 确保子应用可以独立构建和部署
2. 在子应用入口导出生命周期钩子
3. 在基座应用中注册子应用

## 注意事项

- 子应用需要支持跨域访问
- 避免使用全局样式污染
- 合理规划共享依赖 