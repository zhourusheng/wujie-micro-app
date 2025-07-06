<template>
  <div id="order-system">
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
    // 监听主应用传递的路由变化
    '$wujie.props.routePath': {
      handler(newPath) {
        if (newPath && this.isInWujie) {
          this.handleRouteFromMain(newPath);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 处理主应用传递的路由
    handleRouteFromMain(path) {
      console.log('从主应用接收到路由:', path);
      
      // 如果当前路径与目标路径不同，则导航
      if (this.$route.path !== path) {
        this.$router.push(path).catch(err => {
          if (err.name !== 'NavigationDuplicated') {
            console.error('路由跳转失败:', err);
          }
        });
      }
    }
  },
  mounted() {
    console.log('订单系统子应用已挂载');
    
    // 初始化时处理路由
    if (this.isInWujie && window.$wujie && window.$wujie.props && window.$wujie.props.routePath) {
      this.handleRouteFromMain(window.$wujie.props.routePath);
    }
    
    // 监听主应用发送的消息
    if (this.isInWujie && window.$wujie && window.$wujie.bus) {
      // 监听路由变化事件
      window.$wujie.bus.$on('order-system:routeChange', (data) => {
        if (data && data.path) {
          this.handleRouteFromMain(data.path);
        }
      });
      
      // 监听全局事件
      window.$wujie.bus.$on('global-event', (data) => {
        console.log('接收到主应用发送的消息:', data);
      });
    }
  },
  beforeDestroy() {
    // 移除事件监听
    if (this.isInWujie && window.$wujie && window.$wujie.bus) {
      window.$wujie.bus.$off('order-system:routeChange');
      window.$wujie.bus.$off('global-event');
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
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style> 