import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, message, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string;
  createdAt: string;
}

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  // 模拟品牌数据
  useEffect(() => {
    const mockBrands: Brand[] = [
      {
        id: 1,
        name: '苹果',
        description: '全球知名的消费电子品牌',
        logo: 'https://example.com/apple.png',
        createdAt: '2023-01-15'
      },
      {
        id: 2,
        name: '三星',
        description: '韩国电子产品制造商',
        logo: 'https://example.com/samsung.png',
        createdAt: '2023-01-20'
      },
      {
        id: 3,
        name: '华为',
        description: '中国领先的通信设备制造商',
        logo: 'https://example.com/huawei.png',
        createdAt: '2023-02-05'
      },
      {
        id: 4,
        name: '小米',
        description: '中国智能手机和智能硬件制造商',
        logo: 'https://example.com/xiaomi.png',
        createdAt: '2023-02-15'
      }
    ];
    
    setBrands(mockBrands);
  }, []);

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理编辑
  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand);
    setModalVisible(true);
  };

  // 处理删除
  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个品牌吗？',
      onOk() {
        setBrands(brands.filter(brand => brand.id !== id));
        message.success('删除成功');
      },
    });
  };

  // 处理添加
  const handleAdd = () => {
    setEditingBrand(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingBrand) {
        // 更新品牌
        const updatedBrands = brands.map(brand => 
          brand.id === editingBrand.id ? { ...brand, ...values } : brand
        );
        setBrands(updatedBrands);
        message.success('品牌更新成功');
      } else {
        // 添加品牌
        const newBrand: Brand = {
          id: Math.max(...brands.map(b => b.id), 0) + 1,
          ...values,
          logo: 'https://example.com/default.png',
          createdAt: new Date().toISOString().split('T')[0]
        };
        setBrands([...brands, newBrand]);
        message.success('品牌添加成功');
      }
      
      setModalVisible(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <div>
      <Card title="品牌管理" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加品牌
        </Button>
      }>
        <Table 
          columns={columns} 
          dataSource={brands} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingBrand ? '编辑品牌' : '添加品牌'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="品牌名称"
            rules={[{ required: true, message: '请输入品牌名称' }]}
          >
            <Input placeholder="请输入品牌名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="品牌描述"
            rules={[{ required: true, message: '请输入品牌描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入品牌描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagement; 