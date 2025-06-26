import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import WujieVue from 'wujie-vue3';
import { setupWujie } from './utils/wujie';

// 创建Vue应用实例
const app = createApp(App);

// 使用Pinia状态管理
const pinia = createPinia();
app.use(pinia);

// 使用Vue Router
app.use(router);

// 使用Ant Design Vue组件库
app.use(Antd);

// 使用Wujie微前端
app.use(WujieVue);

// 初始化Wujie
setupWujie();

// 挂载应用
app.mount('#app'); 