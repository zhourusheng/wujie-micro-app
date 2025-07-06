import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Divider, Image, Tag, Spin, message } from 'antd';
import { getProductDetail, ProductItem } from '@/api/product';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductItem | null>(null);

  useEffect(() => {
    if (id) {
      loadProductDetail(id);
    }
  }, [id]);

  const loadProductDetail = async (productId: string) => {
    try {
      setLoading(true);
      // 注意：mock数据的返回格式可能与实际API不同
      const response = await getProductDetail(productId);
      setProduct(response.data || null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error('获取商品详情失败');
    }
  };

  if (loading) {
    return <Spin tip="加载中..." />;
  }

  if (!product) {
    return <Card>商品不存在或已被删除</Card>;
  }

  return (
    <div className="product-detail-container">
      <Card title="商品详情">
        <div style={{ display: 'flex', marginBottom: 24 }}>
          <div style={{ marginRight: 24 }}>
            {product.images && product.images.length > 0 ? (
              <Image
                width={200}
                src={product.images[0]}
                fallback="error"
              />
            ) : (
              <div style={{ width: 200, height: 200, background: '#f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                暂无图片
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <Descriptions title={product.name} column={1}>
              <Descriptions.Item label="商品编号">{product.id}</Descriptions.Item>
              <Descriptions.Item label="商品分类">{product.categoryName}</Descriptions.Item>
              <Descriptions.Item label="价格">¥{product.price?.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="库存">{product.stock}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {product.status === 1 ? 
                  <Tag color="green">上架中</Tag> : 
                  <Tag color="red">已下架</Tag>
                }
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider orientation="left">商品介绍</Divider>
        <div 
          className="product-description"
          dangerouslySetInnerHTML={{ __html: product.description || '暂无商品介绍' }} 
        />

        <Divider orientation="left">规格参数</Divider>
        <Descriptions column={2}>
          {product.specs && Object.entries(product.specs).map(([key, value]) => (
            <Descriptions.Item key={key} label={key}>
              {value}
            </Descriptions.Item>
          ))}
          {(!product.specs || Object.keys(product.specs).length === 0) && (
            <Descriptions.Item>暂无规格参数</Descriptions.Item>
          )}
        </Descriptions>

        {product.images && product.images.length > 1 && (
          <>
            <Divider orientation="left">商品图集</Divider>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {product.images.slice(1).map((img, index) => (
                <Image
                  key={index}
                  width={120}
                  src={img}
                  style={{ objectFit: 'cover' }}
                  fallback="error"
                />
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail; 