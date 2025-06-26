<template>
  <div class="user-list-page">
    <h1>用户管理</h1>
    
    <!-- 搜索表单 -->
    <div class="search-form">
      <a-form layout="inline">
        <a-form-item label="用户名">
          <a-input v-model:value="searchForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model:value="searchForm.role" placeholder="请选择角色" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="admin">管理员</a-select-option>
            <a-select-option value="user">普通用户</a-select-option>
            <a-select-option value="guest">访客</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model:value="searchForm.status" placeholder="请选择状态" style="width: 120px">
            <a-select-option value="">全部</a-select-option>
            <a-select-option value="active">激活</a-select-option>
            <a-select-option value="inactive">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-bar">
      <a-button type="primary" @click="handleAdd">
        <template #icon><plus-outlined /></template>
        添加用户
      </a-button>
      <a-button danger :disabled="!hasSelected" @click="handleBatchDelete" style="margin-left: 8px">
        <template #icon><delete-outlined /></template>
        批量删除
      </a-button>
    </div>
    
    <!-- 用户表格 -->
    <a-table
      :columns="columns"
      :data-source="users"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      row-key="id"
    >
      <!-- 状态列 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="record.status === 'active' ? 'green' : 'red'">
            {{ record.status === 'active' ? '激活' : '禁用' }}
          </a-tag>
        </template>
        <!-- 操作列 -->
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="() => handleEdit(record)">编辑</a>
            <a @click="() => handleDetail(record)">详情</a>
            <a-popconfirm
              title="确定要删除此用户吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() => handleDelete(record)"
            >
              <a>删除</a>
            </a-popconfirm>
            <a-popconfirm
              :title="record.status === 'active' ? '确定要禁用此用户吗？' : '确定要启用此用户吗？'"
              ok-text="确定"
              cancel-text="取消"
              @confirm="() => handleToggleStatus(record)"
            >
              <a>{{ record.status === 'active' ? '禁用' : '启用' }}</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const router = useRouter();

// 表格列定义
const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180,
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    fixed: 'right' as const,
    width: 200,
  },
];

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    name: '管理员',
    email: 'admin@example.com',
    role: '管理员',
    status: 'active',
    createTime: '2023-05-20 10:00:00',
  },
  {
    id: 2,
    username: 'user1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '普通用户',
    status: 'active',
    createTime: '2023-05-21 11:23:10',
  },
  {
    id: 3,
    username: 'user2',
    name: '李四',
    email: 'lisi@example.com',
    role: '普通用户',
    status: 'inactive',
    createTime: '2023-05-22 09:45:30',
  },
  {
    id: 4,
    username: 'guest',
    name: '王五',
    email: 'wangwu@example.com',
    role: '访客',
    status: 'active',
    createTime: '2023-05-23 16:22:40',
  },
];

// 搜索表单数据
const searchForm = reactive({
  username: '',
  role: '',
  status: '',
});

// 表格数据
const users = ref(mockUsers);
const loading = ref(false);
const selectedRowKeys = ref<number[]>([]);
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: mockUsers.length,
  showSizeChanger: true,
  showTotal: (total: number) => `共 ${total} 条数据`,
});

// 计算属性
const hasSelected = computed(() => selectedRowKeys.value.length > 0);

// 方法
const handleSearch = () => {
  loading.value = true;
  setTimeout(() => {
    users.value = mockUsers.filter((user) => {
      let match = true;
      if (searchForm.username && !user.username.includes(searchForm.username)) {
        match = false;
      }
      if (searchForm.role && user.role !== searchForm.role) {
        match = false;
      }
      if (searchForm.status && user.status !== searchForm.status) {
        match = false;
      }
      return match;
    });
    loading.value = false;
  }, 500);
};

const handleReset = () => {
  searchForm.username = '';
  searchForm.role = '';
  searchForm.status = '';
  users.value = mockUsers;
};

const handleAdd = () => {
  // 跳转到添加用户页面或打开添加用户对话框
  message.info('添加用户功能开发中...');
};

const handleEdit = (record: any) => {
  // 跳转到编辑用户页面或打开编辑对话框
  message.info(`编辑用户: ${record.username}`);
};

const handleDetail = (record: any) => {
  // 跳转到用户详情页
  router.push(`/detail/${record.id}`);
};

const handleDelete = (record: any) => {
  // 删除单个用户
  users.value = users.value.filter(user => user.id !== record.id);
  message.success(`已删除用户: ${record.username}`);
};

const handleBatchDelete = () => {
  // 批量删除用户
  users.value = users.value.filter(user => !selectedRowKeys.value.includes(user.id));
  message.success(`已删除 ${selectedRowKeys.value.length} 个用户`);
  selectedRowKeys.value = [];
};

const handleToggleStatus = (record: any) => {
  // 切换用户状态
  const newStatus = record.status === 'active' ? 'inactive' : 'active';
  users.value = users.value.map(user => 
    user.id === record.id ? { ...user, status: newStatus } : user
  );
  message.success(`已${newStatus === 'active' ? '启用' : '禁用'}用户: ${record.username}`);
};

const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys;
};

const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};
</script>

<style scoped>
.user-list-page {
  padding: 24px;
}

.search-form {
  margin-bottom: 24px;
  background: #fff;
  padding: 24px;
  border-radius: 2px;
}

.action-bar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start;
}
</style> 