import WujieVue from "wujie-vue3";
import { startApp } from "wujie";
import router from '../router';

// 子应用配置
export interface SubAppConfig {
  name: string;
  url: string;
  exec?: boolean;
  alive?: boolean;
  credentials?: boolean;
  degrade?: boolean;
  plugins?: Array<any>;
  props?: Record<string, any>;
}

// 定义 wujie 窗口接口
interface WujieWindow extends Window {
  __WUJIE?: {
    id: string;
    mount: () => void;
    [key: string]: any;
  };
}

// 获取环境相关的URL
function getHostUrl(port: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction 
    ? `//${window.location.host}/${port}/` 
    : `//localhost:${port}/`;
}

// 定义所有子应用配置
const subApps: Record<string, SubAppConfig> = {
  // 用户中心子应用
  "user-center": {
    name: "user-center",
    url: getHostUrl("8001"),
    alive: true,
  },
  // 商品管理子应用
  "product-management": {
    name: "product-management",
    url: getHostUrl("8002"),
    alive: true,
  },
  // 订单系统子应用
  "order-system": {
    name: "order-system",
    url: getHostUrl("8003"),
    alive: true,
  }
};

// 生命周期对象
const lifecycles = {
  beforeLoad: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 开始加载`);
  },
  beforeMount: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 开始挂载`);
  },
  afterMount: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 挂载完成`);
  },
  beforeUnmount: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 开始卸载`);
  },
  afterUnmount: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 卸载完成`);
  },
  activated: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 已激活`);
  },
  deactivated: (appWindow: WujieWindow) => {
    console.log(`${appWindow.__WUJIE?.id || '未知应用'} 已休眠`);
  },
  loadError: (url: string, e: Error) => {
    console.error(`${url} 加载失败`, e);
  },
};

// 判断是否降级处理
const degrade = window.localStorage.getItem("degrade") === "true" || !window.Proxy || !window.CustomElementRegistry;

// 默认属性
const defaultProps = {
  jump: (name: string) => {
    window.location.href = `/${name}`;
  },
};

// 设置全局通信
export function setupBus() {
  if (WujieVue && typeof WujieVue === 'object' && 'bus' in WujieVue) {
    const bus = WujieVue.bus;
    
    // 监听子应用发送的消息
    bus.$on("mainApp:getToken", (data: any, sender: string) => {
      console.log(`收到${sender}发来的消息:`, data);
      // 向子应用发送token
      bus.$emit("mainApp:setToken", { token: "this-is-main-app-token" });
    });
    
    // 在子应用路由变化时，主应用跳转对应路由高亮菜单栏
    bus.$on("sub-route-change", (name: string, path: string) => {
      console.log(`收到子应用${name}路由变化:`, path);
      // 构建主应用中对应的路径
      let mainPath = '';
      
      switch (name) {
        case 'user-center':
          mainPath = `/user-center${path}`;
          break;
        case 'product-management':
          mainPath = `/product-management${path}`;
          break;
        case 'order-system':
          mainPath = `/order-system${path}`;
          break;
        default:
          return;
      }
      
      // 当前路径与目标路径不一致时进行跳转
      if (router.currentRoute.value.path !== mainPath) {
        router.push(mainPath).catch(err => {
          console.error('路由跳转失败:', err);
        });
      }
    });
    
    // 监听子应用挂载事件
    bus.$on("user-center-mounted", (data: any) => {
      console.log('用户中心子应用已挂载:', data);
    });
    
    bus.$on("product-management-mounted", (data: any) => {
      console.log('商品管理子应用已挂载:', data);
    });
    
    bus.$on("order-system-mounted", (data: any) => {
      console.log('订单系统子应用已挂载:', data);
    });
  }
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

// 启动指定子应用
export function startSubApp(name: string, props?: Record<string, any>) {
  if (!subApps[name]) {
    console.error(`子应用${name}不存在`);
    return;
  }

  const options = {
    ...subApps[name],
    url: subApps[name].url,
    props: {
      ...defaultProps,
      ...(subApps[name].props || {}),
      ...(props || {})
    }
  };

  return startApp(options);
}

// 导出子应用配置和总线
export { subApps };
export const bus = WujieVue.bus; 