<template>
  <div class="user-detail">
    <div class="page-header">
      <el-page-header @back="goBack" :content="`用户详情: ${userData.name || ''}`" />
    </div>
    
    <div class="detail-container" v-loading="loading">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本信息" name="basic">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户ID">{{ userData.id }}</el-descriptions-item>
            <el-descriptions-item label="用户名">{{ userData.username }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ userData.name }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ userData.gender === 1 ? '男' : '女' }}</el-descriptions-item>
            <el-descriptions-item label="电话">{{ userData.phone }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userData.email }}</el-descriptions-item>
            <el-descriptions-item label="部门">{{ userData.department }}</el-descriptions-item>
            <el-descriptions-item label="职位">{{ userData.position }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="userData.status === 1 ? 'success' : 'danger'">
                {{ userData.status === 1 ? '启用' : '禁用' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ userData.createTime }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ userData.lastLogin }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">{{ userData.remark || '无' }}</el-descriptions-item>
          </el-descriptions>
          
          <div class="actions">
            <el-button type="primary" @click="editUser">编辑信息</el-button>
            <el-button 
              :type="userData.status === 1 ? 'danger' : 'success'"
              @click="toggleUserStatus"
            >
              {{ userData.status === 1 ? '禁用账号' : '启用账号' }}
            </el-button>
            <el-button @click="resetPassword">重置密码</el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="角色信息" name="roles">
          <div class="role-list">
            <el-tag 
              v-for="role in userData.roles" 
              :key="role.id"
              class="role-tag"
            >
              {{ role.name }}
            </el-tag>
            
            <el-empty v-if="!userData.roles || userData.roles.length === 0" description="暂无角色信息" />
          </div>
          
          <div class="actions">
            <el-button type="primary" @click="openRoleDialog">分配角色</el-button>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="登录历史" name="history">
          <el-table :data="loginHistory" border style="width: 100%">
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="loginTime" label="登录时间" width="180" />
            <el-table-column prop="ip" label="IP地址" width="150" />
            <el-table-column prop="device" label="设备信息" />
            <el-table-column prop="location" label="登录地点" width="150" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'">
                  {{ scope.row.status === 'success' ? '成功' : '失败' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 角色分配对话框 -->
    <el-dialog title="分配角色" v-model="roleDialogVisible" width="500px">
      <el-checkbox-group v-model="selectedRoles">
        <el-checkbox 
          v-for="role in allRoles" 
          :key="role.id" 
          :label="role.id"
        >
          {{ role.name }}
        </el-checkbox>
      </el-checkbox-group>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUserRoles">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;

// 页面状态
const loading = ref(true);
const activeTab = ref('basic');

// 用户数据
const userData = reactive({
  id: 0,
  username: '',
  name: '',
  gender: 1,
  phone: '',
  email: '',
  department: '',
  position: '',
  status: 1,
  createTime: '',
  lastLogin: '',
  remark: '',
  roles: [] as { id: number; name: string }[]
});

// 登录历史
const loginHistory = ref([
  {
    id: 1,
    loginTime: '2023-10-15 08:30:45',
    ip: '192.168.1.100',
    device: 'Chrome 117.0.5938.132 / Windows 10',
    location: '北京市',
    status: 'success'
  },
  {
    id: 2,
    loginTime: '2023-10-14 17:22:10',
    ip: '192.168.1.100',
    device: 'Chrome 117.0.5938.132 / Windows 10',
    location: '北京市',
    status: 'success'
  },
  {
    id: 3,
    loginTime: '2023-10-13 09:15:32',
    ip: '192.168.1.100',
    device: 'Chrome 117.0.5938.132 / Windows 10',
    location: '北京市',
    status: 'success'
  }
]);

// 角色相关
const roleDialogVisible = ref(false);
const selectedRoles = ref<number[]>([]);
const allRoles = ref([
  { id: 1, name: '管理员' },
  { id: 2, name: '普通用户' },
  { id: 3, name: '访客' },
  { id: 4, name: '运营' },
  { id: 5, name: '财务' }
]);

// 获取用户数据
const fetchUserData = () => {
  loading.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    // 模拟数据
    Object.assign(userData, {
      id: parseInt(userId),
      username: 'user' + userId,
      name: '用户' + userId,
      gender: 1,
      phone: '13800138000',
      email: 'user' + userId + '@example.com',
      department: '技术部',
      position: '工程师',
      status: 1,
      createTime: '2023-09-01 10:00:00',
      lastLogin: '2023-10-15 08:30:45',
      remark: '这是一个测试用户',
      roles: [
        { id: 2, name: '普通用户' }
      ]
    });
    
    // 设置已选角色
    selectedRoles.value = userData.roles.map(role => role.id);
    
    loading.value = false;
  }, 500);
};

// 返回上一页
const goBack = () => {
  router.push('/list');
};

// 编辑用户
const editUser = () => {
  ElMessage.info('编辑用户功能待实现');
};

// 切换用户状态
const toggleUserStatus = () => {
  const action = userData.status === 1 ? '禁用' : '启用';
  
  ElMessageBox.confirm(`确定要${action}该用户账号吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 模拟API调用
      userData.status = userData.status === 1 ? 0 : 1;
      ElMessage.success(`${action}账号成功`);
    })
    .catch(() => {
      // 取消操作
    });
};

// 重置密码
const resetPassword = () => {
  ElMessageBox.confirm('确定要重置该用户的密码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 模拟API调用
      ElMessage.success('密码已重置为默认密码：123456');
    })
    .catch(() => {
      // 取消操作
    });
};

// 打开角色对话框
const openRoleDialog = () => {
  roleDialogVisible.value = true;
};

// 保存用户角色
const saveUserRoles = () => {
  // 模拟API调用
  userData.roles = allRoles.value.filter(role => selectedRoles.value.includes(role.id));
  ElMessage.success('角色分配成功');
  roleDialogVisible.value = false;
};

// 页面加载时获取数据
onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.detail-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.role-list {
  min-height: 100px;
  padding: 20px 0;
}

.role-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  padding: 8px 12px;
}
</style> 