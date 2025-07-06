<template>
  <div id="order-system">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('订单系统子应用已挂载');
    
    // 监听主应用发送的消息
    if (window.$wujie) {
      window.$wujie.bus.$on('global-event', (data) => {
        console.log('接收到主应用发送的消息:', data);
      });
    }
  },
  beforeDestroy() {
    // 移除事件监听
    if (window.$wujie) {
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