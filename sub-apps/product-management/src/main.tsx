import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, MemoryRouter, useNavigate } from 'react-router-dom';
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

// 路由包装组件，用于处理主应用传递的路由信息
const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // 处理主应用传递的路由
    const handleRouteFromMain = () => {
      if (window.$wujie?.props?.routePath) {
        const path = window.$wujie.props.routePath;
        console.log('从主应用接收到路由:', path);
        navigate(path);
      }
    };

    // 初始化时处理路由
    handleRouteFromMain();

    // 监听主应用路由变化事件
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on('product-management:routeChange', (data: any) => {
        if (data && data.path) {
          navigate(data.path);
        }
      });
    }

    // 监听props变化
    const originalPropsGetter = Object.getOwnPropertyDescriptor(window.$wujie || {}, 'props');
    if (originalPropsGetter) {
      let currentProps = window.$wujie?.props;
      Object.defineProperty(window.$wujie, 'props', {
        get() {
          return currentProps;
        },
        set(newProps) {
          const oldPath = currentProps?.routePath;
          currentProps = newProps;
          
          if (newProps.routePath && newProps.routePath !== oldPath) {
            navigate(newProps.routePath);
          }
        },
        enumerable: true,
        configurable: true
      });
    }

    return () => {
      // 清理监听
      window.$wujie?.bus?.$off('product-management:routeChange');
    };
  }, [navigate]);

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