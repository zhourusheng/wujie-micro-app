import { defineStore } from 'pinia';

// 定义全局状态类型
export interface GlobalState {
  token: string | null;
  userInfo: UserInfo | null;
  permissions: string[];
  isCollapsed: boolean;
}

// 用户信息类型
interface UserInfo {
  userId: string;
  username: string;
  avatar?: string;
  role: string;
  email?: string;
}

// 定义全局状态管理
export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    token: localStorage.getItem('token'),
    userInfo: null,
    permissions: [],
    isCollapsed: false,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.userInfo?.username || '未登录',
    userRole: (state) => state.userInfo?.role || '',
    hasPermission: (state) => (permissionCode: string) => 
      state.permissions.includes(permissionCode),
  },
  
  actions: {
    // 设置token
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    
    // 清除token
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
    },
    
    // 设置用户信息
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    
    // 设置权限列表
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    
    // 切换侧边栏折叠状态
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    
    // 登出操作
    logout() {
      this.clearToken();
      this.userInfo = null;
      this.permissions = [];
    },
    
    // 模拟登录
    async login(username: string, password: string) {
      // 这里应该是实际的API调用
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // 模拟登录成功
          this.setToken('mock-token-for-demo');
          this.setUserInfo({
            userId: '1',
            username: username || '管理员',
            role: 'admin',
            avatar: 'https://i.pravatar.cc/300',
          });
          this.setPermissions(['user:read', 'user:create', 'product:read']);
          resolve();
        }, 1000);
      });
    }
  }
}); 