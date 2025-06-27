# 商品管理子应用

基于React 18开发的商品管理子应用，用于无界微前端架构中。

## 功能特性

- 商品信息管理
- SKU管理
- 类目管理
- 商品上下架
- 批量导入导出
- 图片管理

## 项目结构

```
product-management/
├── src/
│   ├── api/                # API接口
│   ├── components/         # 公共组件
│   ├── hooks/              # 自定义Hooks
│   ├── pages/              # 页面组件
│   │   ├── category-management/  # 类目管理
│   │   ├── inventory-management/ # 库存管理
│   │   ├── product-edit/         # 商品编辑
│   │   └── product-list/         # 商品列表
│   ├── store/              # 状态管理
│   └── utils/              # 工具函数
├── App.tsx                 # 应用入口
└── main.tsx               # 主入口，包含wujie生命周期
```

## 开发指南

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 构建生产版本
pnpm build
```

## 微前端集成

该应用支持以下生命周期函数，用于在wujie微前端框架中集成：

- `__WUJIE_MOUNT`: 应用挂载
- `__WUJIE_UNMOUNT`: 应用卸载

## 通信机制

### 接收基座数据

可通过`window.$wujie.props`获取基座传递的数据

### 向基座发送消息

```js
// 事件通信
if (window.__POWERED_BY_WUJIE__) {
  window.$wujie.bus.$emit('eventName', data);
}
``` 