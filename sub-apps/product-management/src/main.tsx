import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter, useNavigate, useLocation } from 'react-router-dom';
import App from './App';
import './index.css';

// 传递给子应用的数据
declare global {
  interface Window {
    // wujie 提供的全局对象
    __POWERED_BY_WUJIE__?: boolean;
    __WUJIE_PUBLIC_PATH__?: string;
    __WUJIE_MOUNT?: () => void;
    __WUJIE_UNMOUNT?: () => void;
    $wujie?: {
      props: {
        routePath?: string;
        routeQuery?: Record<string, string>;
        routeParams?: Record<string, string>;
        [key: string]: any;
      };
      bus: {
        $on: (event: string, callback: Function) => void;
        $emit: (event: string, ...args: any[]) => void;
        $off: (event: string, callback?: Function) => void;
      };
    };
  }
}

// 路由包装组件，用于处理主应用传递的路由信息和同步路由变化
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // 监听主应用路由变化事件
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on('product-management-router-change', (path: string) => {
        console.log('收到主应用路由变更指令:', path);
        if (location.pathname !== path) {
          navigate(path);
        }
      });
    }

    return () => {
      // 清理监听
      if (window.$wujie?.bus) {
        window.$wujie.bus.$off('product-management-router-change');
      }
    };
  }, [navigate, location]);

  // 监听路由变化，同步给主应用
  React.useEffect(() => {
    if (window.$wujie?.bus) {
      // 向主应用发送路由变化事件
      window.$wujie.bus.$emit('sub-route-change', 'product-management', location.pathname);
    }
  }, [location]);

  // 应用挂载时向主应用发送消息
  React.useEffect(() => {
    if (window.$wujie?.bus) {
      window.$wujie.bus.$emit('product-management-mounted', { timestamp: Date.now() });
    }
  }, []);

  return <>{children}</>;
};

// 子应用渲染函数
function render() {
  const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
  
  // 根据运行环境判断使用哪种路由模式
  const isInWujie = window.__POWERED_BY_WUJIE__;
  
  if (isInWujie) {
    // 在微前端环境中运行，使用MemoryRouter避免与主应用路由冲突
    root.render(
      <React.StrictMode>
        <MemoryRouter>
          <RouterWrapper>
            <App />
          </RouterWrapper>
        </MemoryRouter>
      </React.StrictMode>
    );
  } else {
    // 独立运行时使用BrowserRouter
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  }
}

// 作为子应用运行时的生命周期钩子
// 和 wujie 的生命周期对接
if (window.__POWERED_BY_WUJIE__) {
  // 标记已经渲染，为了避免重复渲染
  let isRender = false;
  
  // 注册生命周期钩子
  window.__WUJIE_MOUNT = () => {
    if (!isRender) {
      render();
      isRender = true;
    }
  };
  
  window.__WUJIE_UNMOUNT = () => {
    const root = document.getElementById('root');
    if (root) {
      root.innerHTML = '';
    }
    isRender = false;
  };
  
  // 如果存在 $wujie 对象，则可以直接渲染
  if (window.$wujie?.props) {
    // 手动触发渲染
    window.__WUJIE_MOUNT();
  }
} else {
  // 作为独立应用直接渲染
  render();
} 