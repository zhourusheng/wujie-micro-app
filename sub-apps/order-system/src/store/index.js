import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    orderList: [],
    orderDetail: null,
    returnList: [],
    invoiceList: [],
    logisticsList: [],
    loading: false,
    // 当前用户信息，可能从主应用获取
    userInfo: null,
    token: null
  },
  mutations: {
    setOrderList(state, list) {
      state.orderList = list;
    },
    setOrderDetail(state, detail) {
      state.orderDetail = detail;
    },
    setReturnList(state, list) {
      state.returnList = list;
    },
    setInvoiceList(state, list) {
      state.invoiceList = list;
    },
    setLogisticsList(state, list) {
      state.logisticsList = list;
    },
    setLoading(state, status) {
      state.loading = status;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setToken(state, token) {
      state.token = token;
    }
  },
  actions: {
    // 从主应用获取用户信息
    getUserInfoFromMain({ commit }) {
      if (window.$wujie && window.$wujie.props) {
        const { token, userInfo } = window.$wujie.props;
        if (token) commit('setToken', token);
        if (userInfo) commit('setUserInfo', userInfo);
      }
    },
    // 获取订单列表
    async fetchOrderList({ commit }, params) {
      commit('setLoading', true);
      try {
        // 这里模拟API调用，实际项目中应该是真实的API
        const mockList = [
          { id: 1, orderNo: 'O202305100001', customer: '张三', amount: 199, status: '待发货', createTime: '2023-05-10 10:23:45' },
          { id: 2, orderNo: 'O202305100002', customer: '李四', amount: 299, status: '已发货', createTime: '2023-05-10 11:34:56' },
          { id: 3, orderNo: 'O202305100003', customer: '王五', amount: 399, status: '已完成', createTime: '2023-05-10 12:45:12' }
        ];
        setTimeout(() => {
          commit('setOrderList', mockList);
          commit('setLoading', false);
        }, 500);
      } catch (error) {
        console.error('获取订单列表失败:', error);
        commit('setLoading', false);
      }
    },
    // 获取订单详情
    async fetchOrderDetail({ commit }, id) {
      commit('setLoading', true);
      try {
        // 模拟API调用
        const mockDetail = {
          id,
          orderNo: `O202305100${id.toString().padStart(3, '0')}`,
          customer: '张三',
          phone: '13800138000',
          address: '北京市朝阳区xxx路xxx号',
          products: [
            { id: 101, name: '商品A', price: 99, quantity: 1, total: 99 },
            { id: 102, name: '商品B', price: 100, quantity: 1, total: 100 }
          ],
          amount: 199,
          status: '待发货',
          createTime: '2023-05-10 10:23:45',
          payTime: '2023-05-10 10:25:30',
          payMethod: '微信支付'
        };
        setTimeout(() => {
          commit('setOrderDetail', mockDetail);
          commit('setLoading', false);
        }, 500);
      } catch (error) {
        console.error('获取订单详情失败:', error);
        commit('setLoading', false);
      }
    }
  }
}); 