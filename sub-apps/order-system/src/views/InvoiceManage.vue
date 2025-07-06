<template>
  <div class="invoice-manage">
    <div class="page-header">
      <h2>发票管理</h2>
      <div class="toolbar">
        <el-input
          placeholder="请输入订单号/发票号"
          v-model="searchKeyword"
          style="width: 200px;"
          clearable
          @keyup.enter.native="handleSearch"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="primary" @click="batchGenerate">批量开具</el-button>
      </div>
    </div>

    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filterForm" size="small">
        <el-form-item label="发票状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待开具" value="待开具"></el-option>
            <el-option label="已开具" value="已开具"></el-option>
            <el-option label="已作废" value="已作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable>
            <el-option label="普通发票" value="普通发票"></el-option>
            <el-option label="电子发票" value="电子发票"></el-option>
            <el-option label="增值税发票" value="增值税发票"></el-option>
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
      :data="invoiceList"
      border
      style="width: 100%; margin-top: 20px;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="invoiceNo" label="发票号" width="180"></el-table-column>
      <el-table-column prop="orderNo" label="订单号" width="180"></el-table-column>
      <el-table-column prop="customer" label="购方名称" width="150"></el-table-column>
      <el-table-column prop="taxNumber" label="税号" width="180"></el-table-column>
      <el-table-column prop="type" label="发票类型" width="120"></el-table-column>
      <el-table-column prop="amount" label="发票金额" width="120">
        <template slot-scope="scope">
          ¥{{ scope.row.amount.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="getInvoiceStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="180"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="viewInvoice(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="generateInvoice(scope.row)" v-if="scope.row.status === '待开具'">开具</el-button>
          <el-button type="text" size="small" @click="downloadInvoice(scope.row)" v-if="scope.row.status === '已开具'">下载</el-button>
          <el-button type="text" size="small" @click="voidInvoice(scope.row)" v-if="scope.row.status === '已开具'">作废</el-button>
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
  name: 'InvoiceManage',
  data() {
    return {
      searchKeyword: '',
      filterForm: {
        status: '',
        type: '',
        dateRange: []
      },
      invoiceList: [
        {
          invoiceNo: 'INV2023051201',
          orderNo: 'O202305100001',
          customer: '北京科技有限公司',
          taxNumber: '91110105MA00FEXE2D',
          type: '增值税发票',
          amount: 199,
          status: '待开具',
          createTime: '2023-05-12 10:15:23'
        },
        {
          invoiceNo: 'INV2023051202',
          orderNo: 'O202305090023',
          customer: '上海商贸有限公司',
          taxNumber: '91310115MA00BFXT8G',
          type: '电子发票',
          amount: 299.5,
          status: '已开具',
          createTime: '2023-05-12 11:23:45'
        },
        {
          invoiceNo: 'INV2023051103',
          orderNo: 'O202305080015',
          customer: '个人',
          taxNumber: '',
          type: '普通发票',
          amount: 99.9,
          status: '已作废',
          createTime: '2023-05-11 14:32:18'
        }
      ],
      pageSize: 10,
      currentPage: 1,
      total: 100 // 模拟数据，实际应从API获取
    };
  },
  methods: {
    // 根据状态获取标签类型
    getInvoiceStatusType(status) {
      const map = {
        '待开具': 'warning',
        '已开具': 'success',
        '已作废': 'info'
      };
      return map[status] || 'info';
    },
    // 查看发票详情
    viewInvoice(row) {
      this.$message.info(`查看发票: ${row.invoiceNo}`);
    },
    // 生成发票
    generateInvoice(row) {
      this.$confirm('确认开具此发票?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`发票${row.invoiceNo}已开具成功`);
        // 实际项目中这里应调用API更新状态
        row.status = '已开具';
      }).catch(() => {});
    },
    // 批量生成发票
    batchGenerate() {
      this.$message.info('批量开具发票功能正在开发中');
    },
    // 下载发票
    downloadInvoice(row) {
      this.$message.success(`开始下载发票${row.invoiceNo}`);
    },
    // 作废发票
    voidInvoice(row) {
      this.$confirm('确认作废此发票? 作废后将无法恢复', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success(`发票${row.invoiceNo}已作废`);
        // 实际项目中这里应调用API更新状态
        row.status = '已作废';
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
.invoice-manage {
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