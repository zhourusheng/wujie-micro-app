<template>
  <div class="role-management">
    <h1>角色管理</h1>
    <div class="role-container">
      <div class="role-actions">
        <el-button type="primary" @click="openAddRoleDialog">添加角色</el-button>
      </div>
      
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createdTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="editRole(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加角色' : '编辑角色'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="roleForm" label-width="100px" :rules="rules" ref="roleFormRef">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 角色列表数据
const roleList = ref([
  {
    id: 1,
    name: '管理员',
    description: '系统管理员，拥有所有权限',
    createdTime: '2023-10-01 10:00:00'
  },
  {
    id: 2,
    name: '普通用户',
    description: '普通用户，拥有基础权限',
    createdTime: '2023-10-02 14:30:00'
  },
  {
    id: 3,
    name: '访客',
    description: '访客用户，只有查看权限',
    createdTime: '2023-10-03 09:15:00'
  }
]);

// 对话框状态
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const roleFormRef = ref();

// 角色表单
const roleForm = reactive({
  id: 0,
  name: '',
  description: ''
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
};

// 打开添加角色对话框
const openAddRoleDialog = () => {
  dialogType.value = 'add';
  roleForm.id = 0;
  roleForm.name = '';
  roleForm.description = '';
  dialogVisible.value = true;
};

// 编辑角色
const editRole = (row: any) => {
  dialogType.value = 'edit';
  roleForm.id = row.id;
  roleForm.name = row.name;
  roleForm.description = row.description;
  dialogVisible.value = true;
};

// 提交角色表单
const submitRoleForm = async () => {
  if (!roleFormRef.value) return;
  
  await roleFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加操作
        const newRole = {
          id: roleList.value.length + 1,
          name: roleForm.name,
          description: roleForm.description,
          createdTime: new Date().toLocaleString()
        };
        roleList.value.push(newRole);
        ElMessage.success('添加成功');
      } else {
        // 模拟编辑操作
        const index = roleList.value.findIndex(item => item.id === roleForm.id);
        if (index !== -1) {
          roleList.value[index].name = roleForm.name;
          roleList.value[index].description = roleForm.description;
          ElMessage.success('更新成功');
        }
      }
      dialogVisible.value = false;
    }
  });
};

// 确认删除
const confirmDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 模拟删除操作
      const index = roleList.value.findIndex(item => item.id === row.id);
      if (index !== -1) {
        roleList.value.splice(index, 1);
        ElMessage.success('删除成功');
      }
    })
    .catch(() => {
      // 取消删除
    });
};
</script>

<style scoped>
.role-management {
  padding: 20px;
}

.role-container {
  margin-top: 20px;
}

.role-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 