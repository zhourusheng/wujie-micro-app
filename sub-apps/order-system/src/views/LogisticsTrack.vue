<template>
  <div class="logistics-track">
    <div class="page-header">
      <h2>物流跟踪</h2>
      <div class="toolbar">
        <el-input
          placeholder="请输入订单号/物流单号"
          v-model="searchKeyword"
          style="width: 200px;"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="batchPrint">批量打印运单</el-button>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" size="small">
        <el-form-item label="物流状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待发货" value="待发货"></el-option>
            <el-option label="已发货" value="已发货"></el-option>
            <el-option label="运输中" value="运输中"></el-option>
            <el-option label="已签收" value="已签收"></el-option>
            <el-option label="已退回" value="已退回"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司">
          <el-select v-model="filterForm.company" placeholder="全部" clearable>
            <el-option label="顺丰速运" value="顺丰速运"></el-option>
            <el-option label="京东物流" value="京东物流"></el-option>
            <el-option label="圆通速递" value="圆通速递"></el-option>
            <el-option label="中通快递" value="中通快递"></el-option>
            <el-option label="申通快递" value="申通快递"></el-option>
            <el-option label="韵达速递" value="韵达速递"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货时间">
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
      :data="logisticsList"
      border
      style="width: 100%; margin-top: 20px;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="trackingNo" label="物流单号" width="180"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
      <el-table-column prop="company" label="物流公司" width="120"></el-table-column>
      <el-table-column prop="receiver" label="收件人" width="100"></el-table-column>
      <el-table-column prop="address" label="收货地址" width="250"></el-table-column>
      <el-table-column prop="status" label="物流状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getLogisticsStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shipTime" label="发货时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewTracking(scope.row)">跟踪详情</el-button>
          <el-button type="text" size="small" @click="printLabel(scope.row)">打印面单</el-button>
          <el-button type="text" size="small" @click="updateTracking(scope.row)">更新轨迹</el-button>
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

    <!-- 物流跟踪详情对话框 -->
    <el-dialog
      title="物流跟踪详情"
      :visible.sync="trackingDialogVisible"
      width="600px">
      <div v-if="currentTracking">
        <div class="tracking-header">
          <div>
            <div class="tracking-title">物流单号：{{ currentTracking.trackingNo }}</div>
            <div class="tracking-info">物流公司：{{ currentTracking.company }}</div>
          </div>
          <el-tag :type="getLogisticsStatusType(currentTracking.status)">{{ currentTracking.status }}</el-tag>
        </div>
        
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in trackingDetail"
            :key="index"
            :timestamp="activity.time"
            :type="index === 0 ? 'primary' : ''">
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LogisticsTrack',
  data() {
    return {
      searchKeyword: '',
      filterForm: {
        status: '',
        company: '',
        dateRange: []
      },
      logisticsList: [
        {
          trackingNo: 'SF1234567890',
          orderNo: 'O202305100001',
          company: '顺丰速运',
          receiver: '张三',
          address: '北京市朝阳区xxx路xxx号',
          status: '已签收',
          shipTime: '2023-05-10 15:23:45'
        },
        {
          trackingNo: 'JD9876543210',
          orderNo: 'O202305100002',
          company: '京东物流',
          receiver: '李四',
          address: '上海市浦东新区xxx路xxx号',
          status: '运输中',
          shipTime: '2023-05-10 16:45:12'
        },
        {
          trackingNo: 'YT0123456789',
          orderNo: 'O202305090023',
          company: '圆通速递',
          receiver: '王五',
          address: '广州市天河区xxx路xxx号',
          status: '已发货',
          shipTime: '2023-05-09 10:12:34'
        }
      ],
      // 物流跟踪详情
      trackingDialogVisible: false,
      currentTracking: null,
      trackingDetail: [
        { content: '已签收,签收人是:本人签收', time: '2023-05-12 15:23:45' },
        { content: '派送中,快递员:张师傅,电话:13800138000', time: '2023-05-12 09:23:45' },
        { content: '已到达【北京朝阳区xxx营业点】', time: '2023-05-11 18:23:45' },
        { content: '运输中,即将发往【北京朝阳区xxx营业点】', time: '2023-05-11 10:23:45' },
        { content: '已到达【北京转运中心】', time: '2023-05-11 02:23:45' },
        { content: '已发货', time: '2023-05-10 15:23:45' },
        { content: '订单已出库', time: '2023-05-10 14:23:45' }
      ],
      pageSize: 10,
      currentPage: 1,
      total: 100 // 模拟数据，实际应从API获取
    };
  },
  methods: {
    // 根据状态获取标签类型
    getLogisticsStatusType(status) {
      const map = {
        '待发货': 'info',
        '已发货': 'primary',
        '运输中': 'warning',
        '已签收': 'success',
        '已退回': 'danger'
      };
      return map[status] || 'info';
    },
    // 查看物流跟踪详情
    viewTracking(row) {
      this.currentTracking = row;
      this.trackingDialogVisible = true;
    },
    // 打印物流面单
    printLabel(row) {
      this.$message.success(`正在打印物流单号: ${row.trackingNo} 的面单`);
    },
    // 批量打印运单
    batchPrint() {
      this.$message.info('批量打印面单功能正在开发中');
    },
    // 更新物流轨迹
    updateTracking(row) {
      this.$message.success(`正在更新物流单号: ${row.trackingNo} 的最新轨迹`);
    },
    // 搜索
    handleSearch() {
      this.$message.success(`搜索关键词: ${this.searchKeyword}`);
      // 实际项目中应调用API搜索
    },
    // 筛选
    handleFilter() {
      this.$message.success('应用筛选条件');
      // 实际项目中应调用API筛选
    },
    // 重置筛选
    resetFilter() {
      this.filterForm = {
        status: '',
        company: '',
        dateRange: []
      };
    },
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size;
      // 实际项目中应调用API重新获取数据
    },
    // 页码变化
    handleCurrentChange(page) {
      this.currentPage = page;
      // 实际项目中应调用API重新获取数据
    }
  }
}
</script>

<style scoped>
.logistics-track {
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

.tracking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.tracking-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.tracking-info {
  font-size: 14px;
  color: #606266;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 