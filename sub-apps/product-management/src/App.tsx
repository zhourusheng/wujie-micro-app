import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import ProductList from './pages/product-list';
import ProductEdit from './pages/product-edit';
import CategoryManagement from './pages/category-management';
import InventoryManagement from './pages/inventory-management';

// 布局组件
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/product/list" replace />} />
          <Route path="/product/list" element={<ProductList />} />
          <Route path="/product/edit/:id?" element={<ProductEdit />} />
          <Route path="/product/category" element={<CategoryManagement />} />
          <Route path="/product/inventory" element={<InventoryManagement />} />
          <Route path="*" element={<Navigate to="/product/list" replace />} />
        </Routes>
      </AppLayout>
    </ConfigProvider>
  );
};

export default App; 