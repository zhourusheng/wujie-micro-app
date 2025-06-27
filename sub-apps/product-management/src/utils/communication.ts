/**
 * 微前端通信工具函数
 */

/**
 * 判断当前是否在微前端环境中运行
 */
export const isInWujie = (): boolean => {
  return window.__POWERED_BY_WUJIE__ === true;
};

/**
 * 向基座应用发送消息
 * @param eventName 事件名称
 * @param data 传递的数据
 */
export const sendToBase = <T>(eventName: string, data: T): void => {
  if (isInWujie() && window.$wujie?.bus) {
    window.$wujie.bus.$emit(eventName, data);
  } else {
    console.warn(`当前不在微前端环境中，无法发送事件: ${eventName}`);
  }
};

/**
 * 从基座应用监听消息
 * @param eventName 事件名称
 * @param callback 回调函数
 */
export const listenFromBase = <T>(eventName: string, callback: (data: T) => void): (() => void) => {
  if (isInWujie() && window.$wujie?.bus) {
    window.$wujie.bus.$on(eventName, callback);
    
    // 返回取消监听的函数
    return () => {
      if (window.$wujie?.bus) {
        window.$wujie.bus.$off(eventName, callback);
      }
    };
  }
  
  console.warn(`当前不在微前端环境中，无法监听事件: ${eventName}`);
  return () => {}; // 返回空函数
};

/**
 * 获取基座应用传递的props
 */
export const getBaseProp = <T>(key: string): T | undefined => {
  if (isInWujie() && window.$wujie?.props) {
    return window.$wujie.props[key] as T;
  }
  return undefined;
};

/**
 * 获取所有基座应用传递的props
 */
export const getAllBaseProps = (): Record<string, any> | undefined => {
  if (isInWujie() && window.$wujie?.props) {
    return window.$wujie.props;
  }
  return undefined;
}; 