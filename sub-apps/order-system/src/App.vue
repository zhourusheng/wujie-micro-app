<template>
  <div id="order-system">
    <nav v-if="!isInWujie" class="app-nav">
      <router-link to="/list">订单列表</router-link> | 
      <router-link to="/delivery">发货管理</router-link> | 
      <router-link to="/return">退货管理</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isInWujie: window.$wujie !== undefined
    };
  },
  watch: {
    // 监听路由变化，同步给主应用
    $route() {
      // 在微前端环境下，主动告知主应用路由跳转
      if (window.$wujie && window.$wujie.bus) {
        window.$wujie.bus.$emit("sub-route-change", "order-system", this.$route.path);
      }
    }
  },
  mounted() {
    console.log('订单系统子应用已挂载');
    
    // 监听来自主应用的路由变化指令
    if (window.$wujie && window.$wujie.bus) {
      window.$wujie.bus.$on("order-system-router-change", (path) => {
        console.log('收到主应用路由变更指令:', path);
        // 如果当前路径与目标路径不同，则导航
        if (this.$route.path !== path) {
          this.$router.push(path).catch(err => {
            if (err.name !== 'NavigationDuplicated') {
              console.error('路由跳转失败:', err);
            }
          });
        }
      });
      
      // 向主应用发送挂载成功的消息
      window.$wujie.bus.$emit("order-system-mounted", { timestamp: Date.now() });
    }
  },
  beforeDestroy() {
    // 移除事件监听
    if (window.$wujie && window.$wujie.bus) {
      window.$wujie.bus.$off('order-system-router-change');
    }
  }
}
</script>

<style>
#order-system {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
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
  color: #409EFF;
  font-weight: bold;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style> 