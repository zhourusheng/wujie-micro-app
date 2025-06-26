declare module 'wujie' {
  export function startApp(options: any): void;
  export interface Window {
    __WUJIE: {
      id: string;
      mount: () => void;
      [key: string]: any;
    }
  }
}

declare module 'wujie-vue3' {
  export const bus: {
    $on: (eventName: string, callback: (data: any, from?: string) => void) => void;
    $emit: (eventName: string, data?: any, to?: string) => void;
    $off: (eventName: string, callback?: (data: any, from?: string) => void) => void;
  };
  export default class WujieVue {
    static setup(options: any): void;
  }
}

// 扩展Window接口
interface Window {
  __WUJIE?: {
    id: string;
    mount: () => void;
    [key: string]: any;
  };
  __WUJIE_MOUNT?: () => void;
  __WUJIE_UNMOUNT?: () => void;
  $wujie?: {
    props: {
      routePath?: string;
      routeQuery?: Record<string, string>;
      routeParams?: Record<string, string>;
      token?: string;
      userInfo?: any;
      permissions?: string[];
      sendToMain?: (eventName: string, data: any) => void;
      [key: string]: any;
    };
  };
} 