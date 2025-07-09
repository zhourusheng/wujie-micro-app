/**
 * 微前端子应用认证状态管理助手
 * 用于子应用和主应用之间的认证信息共享
 */

// 用户信息类型
export interface UserInfo {
  id?: string;
  username: string;
  email?: string;
  isAdmin?: boolean;
  permissions?: string[];
  [key: string]: any;
}

// 认证状态接口
export interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  permissions: string[];
  isMainApp: boolean;
}

declare global {
  interface Window {
    $wujie?: {
      props?: {
        token?: string | null;
        userInfo?: UserInfo | null;
        permissions?: string[];
        [key: string]: any;
      };
    };
    wujie?: {
      bus: {
        $on: (eventName: string, callback: Function) => void;
        $once: (eventName: string, callback: Function) => void;
        $off: (eventName: string, callback?: Function) => void;
        $emit: (eventName: string, ...args: any[]) => void;
      };
    };
    __WUJIE?: {
      id: string;
      [key: string]: any;
    };
  }
}

// 判断是否在主应用中运行
export function isInMainApp(): boolean {
  return typeof window !== 'undefined' && 
    window.$wujie !== undefined && 
    window.$wujie.props !== undefined;
}

// 从主应用获取Token
export function getTokenFromMainApp(): string | null {
  if (isInMainApp() && window.$wujie?.props) {
    return window.$wujie.props.token || null;
  }
  return localStorage.getItem('token');
}

// 从主应用获取用户信息
export function getUserInfoFromMainApp(): UserInfo | null {
  if (isInMainApp() && window.$wujie?.props) {
    return window.$wujie.props.userInfo || null;
  }
  return null;
}

// 从主应用获取权限列表
export function getPermissionsFromMainApp(): string[] {
  if (isInMainApp() && window.$wujie?.props) {
    return window.$wujie.props.permissions || [];
  }
  return [];
}

// 请求主应用获取最新认证信息
export function requestAuthInfo(): Promise<AuthState> {
  return new Promise((resolve) => {
    if (!isInMainApp() || !window.wujie || !window.wujie.bus) {
      // 不在主应用中运行，或者无法获取通信总线
      const token = localStorage.getItem('token');
      resolve({
        token,
        userInfo: null,
        permissions: [],
        isMainApp: false
      });
      return;
    }

    // 注册一次性监听器，用于接收主应用发送的认证信息
    const appName = window.__WUJIE?.id || '';
    const eventName = `auth:setAuthInfo:${appName}`;

    // 设置接收超时，避免无限等待
    const timeoutId = setTimeout(() => {
      resolve({
        token: getTokenFromMainApp(),
        userInfo: getUserInfoFromMainApp(),
        permissions: getPermissionsFromMainApp(),
        isMainApp: true
      });
    }, 3000);

    // 监听认证信息
    window.wujie.bus.$once(eventName, (data: any) => {
      clearTimeout(timeoutId);
      resolve({
        token: data.token || null,
        userInfo: data.userInfo || null,
        permissions: data.permissions || [],
        isMainApp: true
      });
    });

    // 请求主应用发送认证信息
    window.wujie.bus.$emit('auth:getToken', { appName }, appName);
  });
}

// 向主应用发送登出请求
export function requestLogout(): void {
  if (isInMainApp() && window.wujie && window.wujie.bus) {
    window.wujie.bus.$emit('auth:logout');
  } else {
    // 独立运行时直接清除本地token
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}

export {}; 