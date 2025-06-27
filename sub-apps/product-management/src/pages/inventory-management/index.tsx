import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const InventoryManagement: React.FC = () => {
  return (
    <div className="inventory-management-container">
      <Card>
        <Title level={4}>库存管理</Title>
        <Paragraph>
          此页面用于管理商品库存，包括入库、出库操作以及库存预警设置。
          在完整版本中，将显示库存记录列表和库存操作表单。
        </Paragraph>
      </Card>
    </div>
  );
};

export default InventoryManagement; 