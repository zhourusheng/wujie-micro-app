import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, Select, Card, message, 
  Popconfirm, Tag, Image, Modal, Form, Upload, Row, Col 
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, 
  UploadOutlined, DownloadOutlined, ImportOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

import { 
  getProductList, 
  ProductItem, 
  ProductQueryParams,
  changeProductStatus,
  batchDeleteProducts,
  exportProducts,
  importProducts
} from '@/api/product';
import { getCategoryList, CategoryItem } from '@/api/category';

const { Option } = Select;

const ProductList: React.FC = () => {
  // 路由
  const navigate = useNavigate();
  
  // 状态
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [importModalVisible, setImportModalVisible] = useState(false);
  
  // 查询条件
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    pageSize: 10,
  });
  
  // 加载商品列表
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response: any = await getProductList(queryParams);
      setProducts(response.list || []);
      setTotal(response.total || 0);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('获取商品列表失败');
    }
  };
  
  // 加载商品分类
  const loadCategories = async () => {
    try {
      const result: any = await getCategoryList();
      setCategories(result || []);
    } catch (error) {
      message.error('获取分类列表失败');
    }
  };
  
  // 初始化加载
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);
  
  // 查询参数变化时重新加载
  useEffect(() => {
    loadProducts();
  }, [queryParams]);
  
  // 搜索处理
  const handleSearch = (values: any) => {
    setQueryParams({
      ...queryParams,
      ...values,
      page: 1, // 搜索重置到第一页
    });
  };
  
  // 分页变化
  const handleTableChange = (pagination: any) => {
    setCurrent(pagination.current);
    setPageSize(pagination.pageSize);
    setQueryParams({
      ...queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
  };
  
  // 上下架状态切换
  const toggleProductStatus = async (id: string | number, currentStatus: 0 | 1) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await changeProductStatus(id, newStatus);
      message.success(`商品${newStatus === 1 ? '上架' : '下架'}成功`);
      loadProducts();
    } catch (error) {
      message.error('操作失败');
    }
  };
  
  // 批量删除
  const handleBatchDelete = async () => {
    if (!selectedRowKeys.length) {
      return message.warning('请选择要删除的商品');
    }
    
    try {
      await batchDeleteProducts(selectedRowKeys as (string | number)[]);
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      loadProducts();
    } catch (error) {
      message.error('批量删除失败');
    }
  };
  
  // 导出商品
  const handleExport = async () => {
    try {
      const response: any = await exportProducts({
        ...queryParams,
        page: undefined,
        pageSize: undefined
      });
      
      // 创建下载链接
      const blob = new Blob([response.data], { 
        type: 'application/vnd.ms-excel' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `商品列表_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      message.error('导出失败');
    }
  };
  
  // 批量导入
  const handleImport = async (file: File) => {
    try {
      await importProducts(file);
      message.success('导入成功');
      setImportModalVisible(false);
      loadProducts();
      return false; // 不自动上传
    } catch (error) {
      message.error('导入失败');
      return false;
    }
  };

  // 表格列配置
  const columns: ColumnsType<ProductItem> = [
    {
      title: '商品图片',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      render: (images: string[]) => images && images.length > 0 ? (
        <Image 
          width={60} 
          height={60} 
          src={images[0]} 
          placeholder={<div style={{width: 60, height: 60, background: '#f0f0f0'}}/>}
          fallback="error"
        />
      ) : null,
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '所属分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        status === 1 ? 
        <Tag color="green">上架中</Tag> : 
        <Tag color="red">已下架</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => navigate(`/product/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要切换商品状态吗？"
            onConfirm={() => toggleProductStatus(record.id, record.status)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type={record.status === 1 ? "default" : "primary"} 
              size="small"
            >
              {record.status === 1 ? '下架' : '上架'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="product-list-container">
      <Card>
        <Form
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Row gutter={[16, 16]} style={{ width: '100%' }}>
            <Col span={6}>
              <Form.Item name="keyword" label="商品名称">
                <Input placeholder="请输入商品名称" allowClear />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId" label="商品分类">
                <Select placeholder="请选择分类" allowClear>
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="商品状态">
                <Select placeholder="请选择状态" allowClear>
                  <Option value={1}>已上架</Option>
                  <Option value={0}>已下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    搜索
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => navigate('/product/edit')}
            >
              新增商品
            </Button>
            <Popconfirm
              title="确定要批量删除所选商品吗？"
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
              disabled={selectedRowKeys.length === 0}
            >
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                disabled={selectedRowKeys.length === 0}
              >
                批量删除
              </Button>
            </Popconfirm>
            <Button 
              icon={<UploadOutlined />}
              onClick={() => setImportModalVisible(true)}
            >
              批量导入
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              导出数据
            </Button>
          </Space>
        </div>
        
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          pagination={{
            current,
            pageSize,
            total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          onChange={handleTableChange}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />
      </Card>
      
      {/* 批量导入弹窗 */}
      <Modal
        title="批量导入商品"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Upload.Dragger
            name="file"
            accept=".xlsx,.xls"
            maxCount={1}
            beforeUpload={(file) => handleImport(file)}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <ImportOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持 .xlsx 或 .xls 格式的Excel文件
            </p>
          </Upload.Dragger>
          <div style={{ marginTop: 16 }}>
            <Button type="link" icon={<DownloadOutlined />}>
              下载导入模板
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList; 