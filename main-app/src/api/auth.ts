import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = 'http://localhost:3001/api';

// 创建axios实例
const authApi = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
authApi.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// 响应拦截器
authApi.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      // 未授权，清除token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 登录接口
export function login(username: string, password: string) {
  return authApi.post('/auth/login', { username, password });
}

// 注册接口
export function register(userData: {
  username: string;
  email: string;
  password: string;
}) {
  return authApi.post('/auth/register', userData);
}

// 登出接口
export function logout() {
  return authApi.post('/auth/logout');
}

// 获取用户信息
export function getUserInfo() {
  return authApi.get('/auth/profile');
}

// 验证token
export function verifyToken(token: string) {
  return authApi.get(`/auth/verify-token?token=${token}`);
}

// 刷新token
export function refreshToken() {
  return authApi.post('/auth/refresh-token');
} 