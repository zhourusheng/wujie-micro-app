import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, Input, InputNumber, Select, Button, message, 
  Upload, Card, Space, Divider, Row, Col 
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { 
  getProductDetail, 
  createProduct, 
  updateProduct, 
  ProductItem 
} from '@/api/product';
import { getCategoryList, CategoryItem } from '@/api/category';

const { Option } = Select;
const { TextArea } = Input;

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 初始化
  useEffect(() => {
    loadCategories();
    if (id) {
      loadProductDetail(id);
    }
  }, [id]);

  // 加载分类数据
  const loadCategories = async () => {
    try {
      const result: any = await getCategoryList();
      setCategories(result || []);
    } catch (error) {
      message.error('获取分类列表失败');
    }
  };

  // 加载商品详情
  const loadProductDetail = async (productId: string) => {
    try {
      setLoading(true);
      const response = await getProductDetail(productId);
      const productData = response.data || {};
      
      // 设置表单值
      form.setFieldsValue({
        name: productData.name,
        categoryId: productData.categoryId,
        price: productData.price,
        stock: productData.stock,
        description: productData.description,
        // 处理规格参数表单
        ...Object.entries(productData.specs || {}).reduce((acc, [key, value]) => {
          acc[`spec_${key}`] = value;
          return acc;
        }, {} as Record<string, any>)
      });

      // 处理图片
      if (productData.images && productData.images.length > 0) {
        const fileList = productData.images.map((url: string, index: number) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: 'done',
          url,
        }));
        setFileList(fileList);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('获取商品信息失败');
    }
  };

  // 处理表单提交
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 提取并处理规格参数
      const specEntries = Object.entries(values).filter(([key]) => key.startsWith('spec_'));
      const specs: Record<string, string> = {};
      
      specEntries.forEach(([key, value]) => {
        if (value) {
          const specName = key.replace('spec_', '');
          specs[specName] = value as string;
        }
      });
      
      // 构建提交数据
      const submitData = {
        name: values.name,
        categoryId: values.categoryId,
        price: values.price,
        stock: values.stock,
        description: values.description || '',
        specs,
        // 获取上传图片的URL列表
        images: fileList.map(file => file.url || '')
          .filter(url => url) // 过滤掉空URL
      };
      
      if (id) {
        // 更新商品
        await updateProduct(id, submitData);
        message.success('商品更新成功');
      } else {
        // 创建商品
        await createProduct(submitData as any);
        message.success('商品创建成功');
      }
      
      setLoading(false);
      navigate('/product/list');
    } catch (error) {
      setLoading(false);
      message.error(id ? '更新商品失败' : '创建商品失败');
    }
  };

  // 图片上传前的检查
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过2MB!');
    }
    
    return isImage && isLt2M;
  };

  // 处理图片上传变化
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // 自定义上传操作
  const customUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;
    
    // 实际项目中，这里应该调用上传API
    // 为了演示，我们模拟上传过程并直接返回一个URL
    try {
      setUploading(true);
      
      // 模拟文件上传，实际项目中应该替换为真实的上传API
      setTimeout(() => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // 上传成功后的处理
          const url = reader.result as string;
          onSuccess({ url }, file);
          setUploading(false);
        };
      }, 1000);
    } catch (error) {
      onError(error);
      setUploading(false);
    }
  };

  // 上传按钮
  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <div className="product-edit-container">
      <Card title={id ? '编辑商品' : '新增商品'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 0,
            stock: 0,
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商品名称"
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="商品分类"
                rules={[{ required: true, message: '请选择商品分类' }]}
              >
                <Select placeholder="请选择商品分类">
                  {categories.map(category => (
                    <Option key={category.id} value={category.id}>{category.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="商品价格"
                rules={[{ required: true, message: '请输入商品价格' }]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                  formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="请输入商品价格"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stock"
                label="库存数量"
                rules={[{ required: true, message: '请输入库存数量' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入库存数量"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="商品图片">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              customRequest={customUpload}
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <div style={{ color: '#999' }}>
              支持jpg、png格式，最多上传8张图片，单张图片不超过2MB
            </div>
          </Form.Item>

          <Form.Item
            name="description"
            label="商品描述"
          >
            <TextArea rows={4} placeholder="请输入商品描述" />
          </Form.Item>

          <Divider orientation="left">规格参数</Divider>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="spec_品牌" label="品牌">
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="spec_型号" label="型号">
                <Input placeholder="请输入型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="spec_材质" label="材质">
                <Input placeholder="请输入材质" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="spec_尺寸" label="尺寸">
                <Input placeholder="请输入尺寸" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {id ? '更新商品' : '创建商品'}
              </Button>
              <Button onClick={() => navigate('/product/list')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProductEdit; 