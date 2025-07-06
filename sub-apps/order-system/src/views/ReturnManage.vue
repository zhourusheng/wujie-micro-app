<template>
  <div class="return-manage">
    <div class="page-header">
      <h2>退换货管理</h2>
      <div class="toolbar">
        <el-input
          placeholder="请输入订单号/退货单号"
          v-model="searchKeyword"
          style="width: 200px;"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" size="small">
        <el-form-item label="退货状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待审核" value="待审核"></el-option>
            <el-option label="已审核" value="已审核"></el-option>
            <el-option label="待收货" value="待收货"></el-option>
            <el-option label="已收货" value="已收货"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
            <el-option label="已拒绝" value="已拒绝"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable>
            <el-option label="仅退款" value="仅退款"></el-option>
            <el-option label="退货退款" value="退货退款"></el-option>
            <el-option label="换货" value="换货"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
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
      :data="returnList"
      border
      style="width: 100%; margin-top: 20px;">
      <el-table-column prop="returnNo" label="退货单号" width="180"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
      <el-table-column prop="customer" label="客户姓名" width="120"></el-table-column>
      <el-table-column prop="type" label="退货类型" width="120"></el-table-column>
      <el-table-column prop="reason" label="退货原因"></el-table-column>
      <el-table-column prop="amount" label="退款金额" width="120">
        <template slot-scope="scope">
          ¥{{ scope.row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <el-tag :type="getReturnStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewReturn(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="approveReturn(scope.row)" v-if="scope.row.status === '待审核'">审核</el-button>
          <el-button type="text" size="small" @click="refundReturn(scope.row)" v-if="scope.row.status === '已收货'">退款</el-button>
          <el-button type="text" size="small" @click="rejectReturn(scope.row)" v-if="scope.row.status === '待审核'">拒绝</el-button>
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
  name: 'ReturnManage',
  data() {
    return {
      searchKeyword: '',
      filterForm: {
        status: '',
        type: '',
        dateRange: []
      },
      returnList: [
        {
          returnNo: 'R202305120001',
          orderNo: 'O202305100001',
          customer: '张三',
          type: '退货退款',
          reason: '商品质量问题',
          amount: 199,
          status: '待审核',
          createTime: '2023-05-12 09:12:34'
        },
        {
          returnNo: 'R202305120002',
          orderNo: 'O202305080015',
          customer: '李四',
          type: '仅退款',
          reason: '多拍/拍错/不想要',
          amount: 99.5,
          status: '已审核',
          createTime: '2023-05-12 10:23:45'
        },
        {
          returnNo: 'R202305110003',
          orderNo: 'O202305070023',
          customer: '王五',
          type: '换货',
          reason: '商品破损',
          amount: 0,
          status: '已收货',
          createTime: '2023-05-11 14:56:12'
        }
      ],
      pageSize: 10,
      currentPage: 1,
      total: 100 // 模拟数据，实际应从API获取
    };
  },
  methods: {
    // 根据状态获取标签类型
    getReturnStatusType(status) {
      const map = {
        '待审核': 'info',
        '已审核': 'primary',
        '待收货': 'warning',
        '已收货': 'success',
        '已退款': 'success',
        '已拒绝': 'danger'
      };
      return map[status] || 'info';
    },
    // 查看退货详情
    viewReturn(row) {
      this.$message.info(`查看退货单: ${row.returnNo}`);
    },
    // 审核退货申请
    approveReturn(row) {
      this.$confirm('确认审核通过该退货申请?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`退货单${row.returnNo}已审核通过`);
        // 实际项目中这里应调用API更新状态
        row.status = '已审核';
      }).catch(() => {});
    },
    // 为退货申请退款
    refundReturn(row) {
      this.$confirm(`确认为该退货申请退款¥${row.amount.toFixed(2)}?`, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`退货单${row.returnNo}已退款`);
        // 实际项目中这里应调用API更新状态
        row.status = '已退款';
      }).catch(() => {});
    },
    // 拒绝退货申请
    rejectReturn(row) {
      this.$prompt('请输入拒绝原因', '拒绝退货', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入拒绝理由'
      }).then(({ value }) => {
        this.$message.success(`退货单${row.returnNo}已拒绝: ${value}`);
        // 实际项目中这里应调用API更新状态
        row.status = '已拒绝';
      }).catch(() => {});
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
        type: '',
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
.return-manage {
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 