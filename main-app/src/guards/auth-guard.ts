import { useAuthStore } from '../store/auth-store';

// 白名单路由（不需要登录即可访问）
const whiteList = ['/login', '/register', '/forgot-password'];

// 全局前置守卫
export async function authGuard(
  to: any, 
  from: any, 
  next: any
) {
  // 获取认证状态
  const authStore = useAuthStore();
  
  // 设置页面标题
  document.title = `${to.meta.title || '未命名页面'} - 微前端平台`;
  
  // 已登录状态
  if (authStore.isLoggedIn) {
    // 如果访问登录页，重定向到首页
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      // 判断用户信息是否已获取
      if (!authStore.userInfo) {
        try {
          // 验证token并获取用户信息
          await authStore.checkAuthState();
          
          // 有用户信息后，放行
          next();
        } catch (error) {
          // token失效，重新登录
          authStore.clearAuth();
          next({
            path: '/login',
            query: { redirect: to.path }
          });
        }
      } else {
        // 已有用户信息，检查页面权限
        if (to.meta.permission && !authStore.hasPermission(to.meta.permission as string)) {
          next('/403'); // 无权限
        } else {
          next(); // 有权限，放行
        }
      }
    }
  } else {
    // 未登录状态
    if (whiteList.includes(to.path)) {
      // 白名单路由，直接放行
      next();
    } else {
      // 非白名单路由，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.path }
      });
    }
  }
} 