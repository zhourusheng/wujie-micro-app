<template>
  <div class="order-list">
    <div class="page-header">
      <h2>订单列表</h2>
      <div class="toolbar">
        <el-input
          placeholder="请输入订单号/客户名"
          v-model="searchKeyword"
          style="width: 200px;"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="exportOrders">批量导出</el-button>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" size="small">
        <el-form-item label="订单状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待付款" value="待付款"></el-option>
            <el-option label="待发货" value="待发货"></el-option>
            <el-option label="已发货" value="已发货"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">筛选</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table
      v-loading="$store.state.loading"
      :data="$store.state.orderList"
      border
      style="width: 100%; margin-top: 20px;">
      <el-table-column prop="orderNo" label="订单号" width="180">
        <template slot-scope="scope">
          <router-link :to="`/order/detail/${scope.row.id}`" class="link-text">{{ scope.row.orderNo }}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="customer" label="客户姓名" width="120"></el-table-column>
      <el-table-column prop="amount" label="订单金额" width="120">
        <template slot-scope="scope">
          ¥{{ scope.row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewOrder(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="printOrder(scope.row)" v-if="scope.row.status !== '已取消'">打印</el-button>
          <el-button type="text" size="small" @click="shipOrder(scope.row)" v-if="scope.row.status === '待发货'">发货</el-button>
          <el-button type="text" size="small" @click="cancelOrder(scope.row)" v-if="['待付款', '待发货'].includes(scope.row.status)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      searchKeyword: '',
      filterForm: {
        status: '',
        dateRange: []
      },
      pageSize: 10,
      currentPage: 1,
      total: 100 // 模拟数据，实际应从API获取
    };
  },
  created() {
    // 获取订单列表
    this.$store.dispatch('fetchOrderList');
    
    // 如果有主应用传递的用户信息，获取它
    this.$store.dispatch('getUserInfoFromMain');
  },
  methods: {
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
    },
    // 查看订单
    viewOrder(order) {
      this.$router.push(`/order/detail/${order.id}`);
    },
    // 打印订单
    printOrder(order) {
      this.$message.success(`正在打印订单: ${order.orderNo}`);
    },
    // 发货
    shipOrder(order) {
      this.$confirm('确认为该订单发货吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`订单${order.orderNo}已发货`);
      }).catch(() => {});
    },
    // 取消订单
    cancelOrder(order) {
      this.$confirm('确认取消该订单吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`订单${order.orderNo}已取消`);
      }).catch(() => {});
    },
    // 搜索
    handleSearch() {
      console.log('搜索关键词:', this.searchKeyword);
      this.$store.dispatch('fetchOrderList', { keyword: this.searchKeyword });
    },
    // 筛选
    handleFilter() {
      console.log('筛选条件:', this.filterForm);
      this.$store.dispatch('fetchOrderList', this.filterForm);
    },
    // 重置筛选
    resetFilter() {
      this.filterForm = {
        status: '',
        dateRange: []
      };
      this.$store.dispatch('fetchOrderList');
    },
    // 导出订单
    exportOrders() {
      this.$message.success('订单导出功能正在开发中');
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      this.$store.dispatch('fetchOrderList', { pageSize: size, page: this.currentPage });
    },
    // 页码变化
    handleCurrentChange(page) {
      this.currentPage = page;
      this.$store.dispatch('fetchOrderList', { pageSize: this.pageSize, page: page });
    }
  }
}
</script>

<style scoped>
.order-list {
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

.filter-card {
  margin-bottom: 20px;
}

.link-text {
  color: #409EFF;
  text-decoration: none;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 