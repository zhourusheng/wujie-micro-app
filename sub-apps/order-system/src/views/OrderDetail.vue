<template>
  <div class="order-detail" v-loading="$store.state.loading">
    <div class="page-header">
      <el-page-header @back="goBack" :content="order ? `订单详情: ${order.orderNo}` : '订单详情'"></el-page-header>
      <div class="toolbar">
        <el-button type="primary" @click="printOrder" v-if="order">打印订单</el-button>
        <el-button @click="exportOrder" v-if="order">导出详情</el-button>
      </div>
    </div>

    <div v-if="order" class="detail-content">
      <el-card class="detail-card" shadow="never">
        <div slot="header">
          <span>订单信息</span>
          <el-tag :type="getStatusType(order.status)" style="margin-left: 10px;">{{ order.status }}</el-tag>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ order.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">{{ order.status }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ order.createTime }}</el-descriptions-item>
          <el-descriptions-item label="支付时间">{{ order.payTime }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">{{ order.payMethod }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ order.amount.toFixed(2) }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card" shadow="never">
        <div slot="header">
          <span>客户信息</span>
        </div>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="客户姓名">{{ order.customer }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ order.phone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">{{ order.address }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="detail-card" shadow="never">
        <div slot="header">
          <span>商品信息</span>
        </div>
        <el-table :data="order.products" border style="width: 100%">
          <el-table-column prop="id" label="商品ID" width="80"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="price" label="单价" width="120">
            <template slot-scope="scope">
              ¥{{ scope.row.price.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
          <el-table-column prop="total" label="小计" width="120">
            <template slot-scope="scope">
              ¥{{ scope.row.total.toFixed(2) }}
            </template>
          </el-table-column>
        </el-table>
        <div class="order-total">
          <span>订单总计: <strong>¥{{ order.amount.toFixed(2) }}</strong></span>
        </div>
      </el-card>

      <el-card class="detail-card" shadow="never">
        <div slot="header">
          <span>操作记录</span>
        </div>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in orderActivities"
            :key="index"
            :timestamp="activity.time"
            :type="activity.type">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
    <div v-else class="no-data">
      <p>未找到订单信息</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetail',
  data() {
    return {
      orderActivities: [
        { content: '订单创建', time: '2023-05-10 10:23:45', type: 'primary' },
        { content: '订单支付成功', time: '2023-05-10 10:25:30', type: 'success' },
        { content: '系统审核通过', time: '2023-05-10 10:30:12', type: 'info' },
        { content: '等待发货', time: '2023-05-10 10:35:25', type: 'warning' }
      ]
    };
  },
  computed: {
    order() {
      return this.$store.state.orderDetail;
    }
  },
  created() {
    // 获取订单ID
    const orderId = this.$route.params.id;
    if (orderId) {
      this.$store.dispatch('fetchOrderDetail', orderId);
    }
  },
  methods: {
    // 返回订单列表
    goBack() {
      this.$router.push('/order/list');
    },
    // 打印订单
    printOrder() {
      this.$message.success(`正在打印订单: ${this.order.orderNo}`);
    },
    // 导出订单
    exportOrder() {
      this.$message.success(`订单${this.order.orderNo}导出中...`);
    },
    // 根据状态获取标签类型
    getStatusType(status) {
      const map = {
        '待付款': 'warning',
        '待发货': 'primary',
        '已发货': 'success',
        '已完成': 'success',
        '已取消': 'info'
      };
      return map[status] || 'info';
    }
  }
}
</script>

<style scoped>
.order-detail {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  gap: 10px;
}

.detail-card {
  margin-bottom: 20px;
}

.order-total {
  text-align: right;
  margin-top: 15px;
  font-size: 16px;
}

.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #909399;
}
</style> 