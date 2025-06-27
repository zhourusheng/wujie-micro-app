import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 如果是下载文件直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    // 自定义状态码检查
    if (res.code !== 200) {
      // 处理特定错误码
      if (res.code === 401) {
        // 如果是在wujie环境中，通过事件总线通知基座应用退出登录
        if (window.__POWERED_BY_WUJIE__ && window.$wujie?.bus) {
          window.$wujie.bus.$emit('logout', { from: 'product-app' });
        } else {
          // 独立运行时重定向到登录页
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(new Error(res.message || 'Error'));
    }
    
    return res.data;
  },
  (error) => {
    // 在wujie环境中，通知基座应用显示错误
    if (window.__POWERED_BY_WUJIE__ && window.$wujie?.bus) {
      window.$wujie.bus.$emit('error', { 
        message: error.message,
        from: 'product-app'
      });
    }
    
    return Promise.reject(error);
  }
);

export default service; 