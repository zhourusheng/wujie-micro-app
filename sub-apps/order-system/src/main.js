import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false;
Vue.use(ElementUI);

let instance = null;

// 微前端环境下的生命周期函数
function render(props = {}) {
  const { container, routePath, routeQuery } = props;
  
  // 可能来自主应用的数据
  if (routePath && typeof routePath === 'string') {
    router.push({
      path: routePath,
      query: routeQuery
    }).catch(() => {});
  }

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}

// 判断是否在微前端环境中
if (window.__WUJIE_MOUNT) {
  // 子应用生命周期函数挂载到window上
  window.__WUJIE_MOUNT = () => {
    render(window.$wujie?.props);
  };
  
  // 子应用卸载函数
  window.__WUJIE_UNMOUNT = () => {
    instance && instance.$destroy();
    instance = null;
  };
} else {
  // 独立运行时直接渲染
  render();
} 