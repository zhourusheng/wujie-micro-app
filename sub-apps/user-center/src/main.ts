import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

// 声明生命周期钩子，供基座应用调用
declare global {
  interface Window {
    // 子应用生命周期
    __WUJIE_MOUNT: () => void;
    __WUJIE_UNMOUNT: () => void;
    // 子应用实例
    __WUJIE: {
      mount: () => void;
    };
    // props数据
    $wujie: {
      props: {
        routePath?: string;
        routeQuery?: Record<string, string>;
        routeParams?: Record<string, string>;
        token?: string;
        userInfo?: any;
        permissions?: string[];
        sendToMain?: (eventName: string, data: any) => void;
      };
    };
  }
}

let app: ReturnType<typeof createApp>;

// 创建Vue应用实例
function createVueApp() {
  // 创建Pinia实例
  const pinia = createPinia();
  
  // 创建Vue应用
  app = createApp(App);
  
  // 注册插件
  app.use(pinia);
  app.use(router);
  app.use(Antd);
  app.use(ElementPlus);
  
  // 返回应用实例
  return app;
}

// 独立运行时
if (window.__WUJIE_MOUNT) {
  // 子应用挂载函数
  window.__WUJIE_MOUNT = () => {
    createVueApp().mount('#app');
  };
  
  // 子应用卸载函数
  window.__WUJIE_UNMOUNT = () => {
    app?.unmount();
  };
} else {
  // 独立运行时直接挂载
  createVueApp().mount('#app');
} 