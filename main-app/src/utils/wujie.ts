import { startApp, bus } from "wujie";

// 子应用配置
export interface SubAppConfig {
  name: string;
  entry: string;
  exec?: boolean;
  alive?: boolean;
  credentials?: boolean;
  degrade?: boolean;
  plugins?: Array<any>;
  props?: Record<string, any>;
}

// 定义所有子应用配置
const subApps: Record<string, SubAppConfig> = {
  // 用户中心子应用
  "user-center": {
    name: "user-center",
    entry: "//localhost:8001/",
    alive: true,
  },
  // 商品管理子应用
  "product-management": {
    name: "product-management",
    entry: "//localhost:8002/",
    alive: true,
  },
  // 订单系统子应用
  "order-system": {
    name: "order-system",
    entry: "//localhost:8003/",
    alive: true,
  },
  // 数据分析子应用
  "data-analytics": {
    name: "data-analytics",
    entry: "//localhost:8004/",
    alive: true,
  },
  // 营销活动子应用
  "marketing": {
    name: "marketing",
    entry: "//localhost:8005/",
    alive: true,
  },
  // 库存管理子应用
  "inventory": {
    name: "inventory",
    entry: "//localhost:8006/",
    alive: true,
  },
  // 系统设置子应用
  "settings": {
    name: "settings",
    entry: "//localhost:8007/",
    alive: true,
  }
};

// 全局默认配置
const defaultOptions = {
  loading: process.env.NODE_ENV !== 'production' ? undefined : (loadingApp: string) => {
    return `<div style="display: flex; justify-content: center; align-items: center; height: 100%;">
      <div class="ant-spin ant-spin-lg ant-spin-spinning">
        <span class="ant-spin-dot ant-spin-dot-spin">
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
          <i class="ant-spin-dot-item"></i>
        </span>
        <div class="ant-spin-text">加载应用 ${loadingApp} 中...</div>
      </div>
    </div>`;
  },
  beforeLoad: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 开始加载`);
  },
  beforeMount: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 开始挂载`);
  },
  afterMount: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 挂载完成`);
  },
  beforeUnmount: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 开始卸载`);
  },
  afterUnmount: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 卸载完成`);
  },
  activated: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 已激活`);
  },
  deactivated: (appWindow: Window) => {
    console.log(`${appWindow.__WUJIE.id} 已休眠`);
  },
  loadError: (url: string, e: Error) => {
    console.error(`${url} 加载失败`, e);
  },
};

// 预加载子应用
export function preloadApps() {
  // 预加载核心应用
  const preloadAppNames = ['user-center', 'product-management', 'order-system'];
  preloadAppNames.forEach(name => {
    startApp(subApps[name]);
  });
}

// 启动指定子应用
export function startSubApp(name: string, props?: Record<string, any>) {
  if (!subApps[name]) {
    console.error(`子应用${name}不存在`);
    return;
  }

  const options = {
    ...subApps[name],
    props: {
      ...(subApps[name].props || {}),
      ...(props || {})
    }
  };

  return startApp(options);
}

// 设置全局通信
export function setupBus() {
  // 监听子应用发送的消息
  bus.$on("mainApp:getToken", (data, sender) => {
    console.log(`收到${sender}发来的消息:`, data);
    // 向子应用发送token
    bus.$emit("mainApp:setToken", { token: "this-is-main-app-token" });
  });
}

// 初始化无界微前端
export function setupWujie() {
  // 设置全局通信
  setupBus();
  
  // 预加载应用
  preloadApps();
}

// 导出子应用配置，方便外部使用
export { subApps, bus }; 