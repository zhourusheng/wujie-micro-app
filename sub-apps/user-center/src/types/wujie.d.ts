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