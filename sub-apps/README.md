# 子应用改造指南

本文档总结了如何将子应用与wujie官方示例保持一致，确保子应用能够正确地与主应用通信和集成。

## 通用改造要点

### 1. 路由同步机制

所有子应用都应实现以下通信机制：

1. **向主应用同步路由变化**：
   ```javascript
   // 在路由变化时
   window.$wujie?.bus.$emit("sub-route-change", "子应用名称", 当前路径);
   ```

2. **监听主应用的路由指令**：
   ```javascript
   // 在应用挂载时
   window.$wujie?.bus.$on("子应用名称-router-change", (path) => {
     // 导航到指定路径
     router.push(path);
   });
   ```

3. **向主应用发送挂载成功消息**：
   ```javascript
   window.$wujie?.bus.$emit("子应用名称-mounted", { timestamp: Date.now() });
   ```

### 2. 生命周期对接

所有子应用都需要正确实现wujie的生命周期钩子：

```javascript
// 判断是否在微前端环境中
if (window.__POWERED_BY_WUJIE__) {
  window.__WUJIE_MOUNT = () => {
    // 挂载应用
  };
  
  window.__WUJIE_UNMOUNT = () => {
    // 卸载应用
  };
}
```

## Vue3子应用改造（user-center）

Vue3子应用使用选项式API实现通信：

```vue
<script>
export default {
  watch: {
    $route() {
      if (window.$wujie?.bus) {
        window.$wujie.bus.$emit("sub-route-change", "user-center", this.$route.path);
      }
    }
  },
  mounted() {
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on("user-center-router-change", (path) => {
        this.$router.push(path);
      });
    }
  }
};
</script>
```

## React子应用改造（product-management）

React子应用使用路由包装组件实现通信：

```jsx
const RouterWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 监听主应用路由指令
  React.useEffect(() => {
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on('product-management-router-change', (path) => {
        navigate(path);
      });
    }
    
    return () => {
      window.$wujie?.bus?.$off('product-management-router-change');
    };
  }, [navigate]);

  // 向主应用同步路由变化
  React.useEffect(() => {
    if (window.$wujie?.bus) {
      window.$wujie.bus.$emit('sub-route-change', 'product-management', location.pathname);
    }
  }, [location]);

  return <>{children}</>;
};
```

## Vue2子应用改造（order-system）

Vue2子应用的实现方式与Vue3类似：

```vue
<script>
export default {
  watch: {
    $route() {
      if (window.$wujie?.bus) {
        window.$wujie.bus.$emit("sub-route-change", "order-system", this.$route.path);
      }
    }
  },
  mounted() {
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on("order-system-router-change", (path) => {
        this.$router.push(path);
      });
    }
  }
};
</script>
```

## 独立运行与微前端环境

所有子应用都应该能够在两种模式下正常工作：

1. **独立运行模式**：作为独立应用访问
2. **微前端模式**：被主应用加载

在独立运行模式下，应显示完整的导航菜单；在微前端模式下，可以隐藏导航菜单：

```vue
<nav v-if="!isInWujie" class="app-nav">
  <!-- 导航链接 -->
</nav>
```

## 样式隔离

确保子应用的样式不会影响主应用或其他子应用：

1. 使用作用域样式（scoped）
2. 为子应用根元素添加唯一类名
3. 避免修改全局样式 