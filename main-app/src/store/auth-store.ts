import { defineStore } from 'pinia';
import { login, refreshToken, getUserInfo } from '../api/auth';
import { useGlobalStore } from './index';

interface UserInfo {
  id?: string;
  username: string;
  email?: string;
  isAdmin?: boolean;
  permissions?: string[];
  avatar?: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  permissions: string[];
  refreshTokenTimer: number | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    userInfo: null,
    permissions: [],
    refreshTokenTimer: null
  }),
  
  getters: {
    isLoggedIn: (state: AuthState) => !!state.token,
    hasPermission: (state: AuthState) => (permissionCode: string) => state.permissions.includes(permissionCode)
  },
  
  actions: {
    async loginAction(username: string, password: string) {
      try {
        // 调用登录API
        const response = await login(username, password);
        this.setToken(response.access_token);
        this.setUserInfo(response.user);
        
        // 设置token自动刷新
        this.setupTokenRefresh();
        return true;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },
    
    async logoutAction() {
      // JWT是无状态的，只需要在客户端清除token即可
      // 不需要调用后端的logout接口
      
      // 清除认证状态
      this.clearAuth();
      
      // 同步清除全局状态
      const globalStore = useGlobalStore();
      globalStore.logout();
      
      return true;
    },
    
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      this.permissions = userInfo.permissions || [];
    },
    
    clearAuth() {
      this.token = null;
      this.userInfo = null;
      this.permissions = [];
      localStorage.removeItem('token');
      
      if (this.refreshTokenTimer !== null) {
        clearTimeout(this.refreshTokenTimer);
        this.refreshTokenTimer = null;
      }
    },
    
    setupTokenRefresh() {
      // 假设token有效期为1小时，提前5分钟刷新
      const refreshTime = 55 * 60 * 1000;
      
      this.refreshTokenTimer = window.setTimeout(async () => {
        try {
          const response = await refreshToken();
          this.setToken(response.access_token);
          this.setupTokenRefresh();
        } catch (error) {
          console.error('刷新token失败:', error);
          // 刷新失败，可能需要重新登录
          this.clearAuth();
        }
      }, refreshTime) as unknown as number;
    },
    
    async checkAuthState() {
      if (!this.token) return false;
      
      try {
        // 验证token有效性
        const response = await getUserInfo();
        this.setUserInfo(response);
        
        // 同步用户信息到全局状态
        const globalStore = useGlobalStore();
        if (this.userInfo) {
          globalStore.setUserInfo({
            userId: this.userInfo.id || '',
            username: this.userInfo.username,
            role: this.userInfo.isAdmin ? 'admin' : 'user',
            email: this.userInfo.email,
            avatar: this.userInfo.avatar
          });
          globalStore.setToken(this.token);
          globalStore.setPermissions(this.permissions);
        }
        
        return true;
      } catch (error) {
        console.warn('验证token失败，可能后端服务未启动:', error);
        // 如果后端服务未启动，不清除token，但返回false
        // this.clearAuth();
        return false;
      }
    }
  }
}); 