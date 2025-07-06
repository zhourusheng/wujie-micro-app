<template>
  <div class="user-center-app">
    <nav v-if="!isInWujie" class="app-nav">
      <router-link to="/list">用户列表</router-link> | 
      <router-link to="/role">角色管理</router-link> | 
      <router-link to="/permission">权限配置</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'UserCenterApp',
  data() {
    return {
      isInWujie: window.$wujie !== undefined
    };
  },
  watch: {
    // 监听路由变化，同步给主应用
    $route() {
      // 在微前端环境下，主动告知主应用路由跳转
      if (window.$wujie?.bus) {
        window.$wujie.bus.$emit("sub-route-change", "user-center", this.$route.path);
      }
    }
  },
  mounted() {
    console.log('用户中心子应用已挂载');
    
    // 监听来自主应用的路由变化指令
    if (window.$wujie?.bus) {
      window.$wujie.bus.$on("user-center-router-change", (path) => {
        console.log('收到主应用路由变更指令:', path);
        // 如果当前路径与目标路径不同，则导航
        if (this.$route.path !== path) {
          this.$router.push(path).catch(err => {
            console.error('路由跳转失败:', err);
          });
        }
      });
    }
    
    // 向主应用发送挂载成功的消息
    if (window.$wujie?.bus) {
      window.$wujie.bus.$emit("user-center-mounted", { timestamp: Date.now() });
    }
  }
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.user-center-app {
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.app-nav {
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.app-nav a {
  margin: 0 10px;
  color: #333;
  text-decoration: none;
}

.app-nav a.router-link-active {
  color: #1890ff;
  font-weight: bold;
}
</style> 