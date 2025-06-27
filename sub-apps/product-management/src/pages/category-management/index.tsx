import React, { useState, useEffect } from 'react';
import {
  Table, Button, Space, Input, Card, message,
  Popconfirm, Form, Modal, Tree
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode } from 'antd/es/tree';

import {
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryItem
} from '@/api/category';

const CategoryManagement: React.FC = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);

  // 初始化加载
  useEffect(() => {
    loadCategories();
  }, []);

  // 加载分类数据
  const loadCategories = async () => {
    try {
      setLoading(true);
      const result: any = await getCategoryList();
      setCategories(result || []);
      
      // 转换为树形结构数据
      const treeData = buildTreeData(result || []);
      setTreeData(treeData);
      
      // 默认展开第一级
      const expandedKeys = result
        .filter((item: CategoryItem) => item.parentId === 0)
        .map((item: CategoryItem) => item.id);
      setExpandedKeys(expandedKeys);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('获取分类列表失败');
    }
  };

  // 构建树形结构数据
  const buildTreeData = (items: CategoryItem[]): DataNode[] => {
    // 一级分类
    const rootItems = items.filter(item => item.parentId === 0);
    
    // 递归构建树
    const buildTree = (items: CategoryItem[]): DataNode[] => {
      return items.map(item => {
        const children = categories.filter(child => child.parentId === item.id);
        return {
          title: item.name,
          key: item.id,
          icon: <AppstoreOutlined />,
          children: children.length > 0 ? buildTree(children) : undefined
        };
      });
    };
    
    return buildTree(rootItems);
  };

  // 打开新增/编辑表单
  const openFormModal = (category?: CategoryItem) => {
    setEditingCategory(category || null);
    form.resetFields();
    
    if (category) {
      form.setFieldsValue({
        name: category.name,
        parentId: category.parentId,
        sort: category.sort,
        icon: category.icon
      });
    }
    
    setModalVisible(true);
  };

  // 关闭表单
  const closeFormModal = () => {
    setModalVisible(false);
    setEditingCategory(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      if (editingCategory) {
        // 更新分类
        await updateCategory(editingCategory.id, values);
        message.success('更新分类成功');
      } else {
        // 创建分类
        await createCategory(values);
        message.success('创建分类成功');
      }
      
      closeFormModal();
      loadCategories();
    } catch (error) {
      setLoading(false);
      message.error(editingCategory ? '更新分类失败' : '创建分类失败');
    }
  };

  // 删除分类
  const handleDelete = async (id: string | number) => {
    try {
      setLoading(true);
      await deleteCategory(id);
      message.success('删除分类成功');
      loadCategories();
    } catch (error) {
      setLoading(false);
      message.error('删除分类失败');
    }
  };

  // 表格列配置
  const columns: ColumnsType<CategoryItem> = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '父级分类',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId) => {
        if (parentId === 0) return '顶级分类';
        const parent = categories.find(item => item.id === parentId);
        return parent ? parent.name : '-';
      }
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      sorter: (a, b) => (a.sort || 0) - (b.sort || 0),
    },
    {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => icon ? <span className={icon} /> : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openFormModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该分类吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="category-management-container">
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* 左侧分类树 */}
        <Card title="分类树" style={{ width: 300 }}>
          <Tree
            showIcon
            defaultExpandAll
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            treeData={treeData}
          />
        </Card>
        
        {/* 右侧分类列表 */}
        <Card title="分类列表" style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openFormModal()}
            >
              新增分类
            </Button>
          </div>
          
          <Table
            rowKey="id"
            columns={columns}
            dataSource={categories}
            loading={loading}
            pagination={false}
          />
        </Card>
      </div>
      
      {/* 分类表单弹窗 */}
      <Modal
        title={editingCategory ? '编辑分类' : '新增分类'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={closeFormModal}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ parentId: 0, sort: 0 }}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          
          <Form.Item
            name="parentId"
            label="父级分类"
          >
            <Input.Group compact>
              <Input 
                style={{ width: '100%' }} 
                readOnly 
                value={0}
                addonAfter="仅支持两级分类，当前为顶级分类"
              />
            </Input.Group>
          </Form.Item>
          
          <Form.Item
            name="sort"
            label="排序"
          >
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          
          <Form.Item
            name="icon"
            label="图标"
          >
            <Input placeholder="图标类名，如 anticon-user" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement; 