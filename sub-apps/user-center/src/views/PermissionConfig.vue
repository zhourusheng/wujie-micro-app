<template>
  <div class="permission-config">
    <h1>权限配置</h1>
    <div class="permission-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="权限列表" name="list">
          <div class="permission-actions">
            <el-button type="primary" @click="openAddPermissionDialog">添加权限</el-button>
          </div>
          
          <el-table :data="permissionList" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="权限名称" width="150" />
            <el-table-column prop="code" label="权限编码" width="150" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button size="small" @click="editPermission(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="confirmDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="角色权限分配" name="assign">
          <el-select v-model="selectedRole" placeholder="请选择角色" style="width: 200px; margin-bottom: 20px;">
            <el-option 
              v-for="role in roleList" 
              :key="role.id" 
              :label="role.name" 
              :value="role.id" 
            />
          </el-select>
          
          <div v-if="selectedRole" class="permission-tree-container">
            <el-tree
              ref="permissionTreeRef"
              :data="permissionTree"
              show-checkbox
              node-key="id"
              :default-checked-keys="checkedPermissions"
              :props="{ label: 'name', children: 'children' }"
            />
            
            <div class="tree-actions">
              <el-button type="primary" @click="saveRolePermissions">保存权限设置</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加/编辑权限对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加权限' : '编辑权限'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="permissionForm" label-width="100px" :rules="rules" ref="permissionFormRef">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="permissionForm.name" placeholder="请输入权限名称" />
        </el-form-item>
        <el-form-item label="权限编码" prop="code">
          <el-input v-model="permissionForm.code" placeholder="请输入权限编码" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="permissionForm.description"
            type="textarea"
            placeholder="请输入权限描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitPermissionForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 当前活动标签
const activeTab = ref('list');

// 权限列表数据
const permissionList = ref([
  {
    id: 1,
    name: '用户查看',
    code: 'user:view',
    description: '查看用户列表和详情'
  },
  {
    id: 2,
    name: '用户编辑',
    code: 'user:edit',
    description: '编辑用户信息'
  },
  {
    id: 3,
    name: '用户删除',
    code: 'user:delete',
    description: '删除用户'
  },
  {
    id: 4,
    name: '角色管理',
    code: 'role:manage',
    description: '管理角色'
  },
  {
    id: 5,
    name: '权限管理',
    code: 'permission:manage',
    description: '管理权限'
  }
]);

// 角色列表
const roleList = ref([
  {
    id: 1,
    name: '管理员',
    permissions: [1, 2, 3, 4, 5]
  },
  {
    id: 2,
    name: '普通用户',
    permissions: [1]
  },
  {
    id: 3,
    name: '访客',
    permissions: []
  }
]);

// 对话框状态
const dialogVisible = ref(false);
const dialogType = ref<'add' | 'edit'>('add');
const permissionFormRef = ref();

// 权限表单
const permissionForm = reactive({
  id: 0,
  name: '',
  code: '',
  description: ''
});

// 表单验证规则
const rules = {
  name: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限编码', trigger: 'blur' }]
};

// 权限树
const permissionTree = computed(() => {
  return [
    {
      id: 'user',
      name: '用户模块',
      children: permissionList.value
        .filter(p => p.code.startsWith('user:'))
        .map(p => ({ ...p }))
    },
    {
      id: 'role',
      name: '角色模块',
      children: permissionList.value
        .filter(p => p.code.startsWith('role:'))
        .map(p => ({ ...p }))
    },
    {
      id: 'permission',
      name: '权限模块',
      children: permissionList.value
        .filter(p => p.code.startsWith('permission:'))
        .map(p => ({ ...p }))
    }
  ];
});

// 选中的角色
const selectedRole = ref<number | null>(null);
const permissionTreeRef = ref();

// 当前选中角色的权限
const checkedPermissions = computed(() => {
  if (!selectedRole.value) return [];
  const role = roleList.value.find(r => r.id === selectedRole.value);
  return role ? role.permissions : [];
});

// 打开添加权限对话框
const openAddPermissionDialog = () => {
  dialogType.value = 'add';
  permissionForm.id = 0;
  permissionForm.name = '';
  permissionForm.code = '';
  permissionForm.description = '';
  dialogVisible.value = true;
};

// 编辑权限
const editPermission = (row: any) => {
  dialogType.value = 'edit';
  permissionForm.id = row.id;
  permissionForm.name = row.name;
  permissionForm.code = row.code;
  permissionForm.description = row.description;
  dialogVisible.value = true;
};

// 提交权限表单
const submitPermissionForm = async () => {
  if (!permissionFormRef.value) return;
  
  await permissionFormRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加操作
        const newPermission = {
          id: permissionList.value.length + 1,
          name: permissionForm.name,
          code: permissionForm.code,
          description: permissionForm.description
        };
        permissionList.value.push(newPermission);
        ElMessage.success('添加成功');
      } else {
        // 模拟编辑操作
        const index = permissionList.value.findIndex(item => item.id === permissionForm.id);
        if (index !== -1) {
          permissionList.value[index].name = permissionForm.name;
          permissionList.value[index].code = permissionForm.code;
          permissionList.value[index].description = permissionForm.description;
          ElMessage.success('更新成功');
        }
      }
      dialogVisible.value = false;
    }
  });
};

// 确认删除
const confirmDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除权限 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 模拟删除操作
      const index = permissionList.value.findIndex(item => item.id === row.id);
      if (index !== -1) {
        permissionList.value.splice(index, 1);
        ElMessage.success('删除成功');
      }
    })
    .catch(() => {
      // 取消删除
    });
};

// 保存角色权限
const saveRolePermissions = () => {
  if (!selectedRole.value || !permissionTreeRef.value) return;
  
  // 获取选中的权限ID
  const checkedKeys = permissionTreeRef.value.getCheckedKeys();
  const halfCheckedKeys = permissionTreeRef.value.getHalfCheckedKeys();
  const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys].filter(id => typeof id === 'number');
  
  // 更新角色权限
  const roleIndex = roleList.value.findIndex(r => r.id === selectedRole.value);
  if (roleIndex !== -1) {
    roleList.value[roleIndex].permissions = allCheckedKeys;
    ElMessage.success('权限设置保存成功');
  }
};
</script>

<style scoped>
.permission-config {
  padding: 20px;
}

.permission-container {
  margin-top: 20px;
}

.permission-actions {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
}

.permission-tree-container {
  border: 1px solid #e0e0e0;
  padding: 20px;
  border-radius: 4px;
}

.tree-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 