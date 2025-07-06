# 无界微前端架构优化方案

## 1. 项目概述

当前项目是基于无界（wujie）微前端框架的应用架构，包含一个基座应用和三个子应用：

- **基座应用**：Vue3 + TypeScript + Vite + Pinia + Ant Design Vue
- **子应用**：
  - **用户中心**：Vue3 + TypeScript + Vite + Pinia
  - **商品管理**：React18 + TypeScript + Vite
  - **订单系统**：Vue2 + JavaScript + Element UI

项目采用pnpm Monorepo方式管理，但目前存在依赖重复、共享资源不足、构建配置不统一等问题。本文档提出全面的优化方案，旨在提升开发效率、减少资源浪费、增强应用性能。

## 2. 架构优化

### 2.1 目录结构重构

```
wujie-micro-app/
├── main-app/                # 基座应用
├── sub-apps/                # 子应用
├── shared/                  # 共享资源
│   ├── components/          # 共享组件
│   ├── utils/               # 共享工具函数
│   ├── hooks/               # 共享hooks
│   ├── styles/              # 共享样式
│   ├── types/               # 共享类型定义
│   ├── build-config/        # 共享构建配置
│   └── api-client/          # 共享API客户端
├── scripts/                 # 工具脚本
└── docs/                    # 项目文档
```

### 2.2 依赖管理优化

创建根目录`.npmrc`文件，配置依赖提升：

```
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=@types/*
public-hoist-pattern[]=vite
shamefully-hoist=true
```

更新`pnpm-workspace.yaml`，确保包含所有工作区：

```yaml
packages:
  # 基座应用
  - 'main-app'
  # 子应用
  - 'sub-apps/*'
  # 共享资源
  - 'shared/*'
  # 工具脚本
  - 'scripts'
``` 