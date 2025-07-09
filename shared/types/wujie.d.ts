/**
 * wujie类型声明文件
 * 为了解决TypeScript类型检查问题
 */

export interface WujieProps {
  token?: string;
  userInfo?: any;
  permissions?: string[];
  [key: string]: any;
}

export interface WujieBus {
  $on: (eventName: string, callback: Function) => void;
  $once: (eventName: string, callback: Function) => void;
  $off: (eventName: string, callback?: Function) => void;
  $emit: (eventName: string, ...args: any[]) => void;
}

export interface WujieInstance {
  bus: WujieBus;
  [key: string]: any;
}

export interface WujieInfo {
  id?: string;
  mount?: () => void;
  unmount?: () => void;
  [key: string]: any;
}

declare global {
  interface Window {
    $wujie?: {
      props?: WujieProps;
      [key: string]: any;
    };
    wujie?: WujieInstance;
    __WUJIE?: WujieInfo;
    [key: string]: any;
  }
}

export {}; 