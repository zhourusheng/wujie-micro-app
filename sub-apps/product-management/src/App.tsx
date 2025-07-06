import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// 页面组件
import ProductList from './pages/product-list';
import ProductEdit from './pages/product-edit';
import CategoryManagement from './pages/category-management';
import InventoryManagement from './pages/inventory-management';
import BrandManagement from './pages/brand-management';

// 布局组件
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={<ProductList />} />
          <Route path="/edit/:id?" element={<ProductEdit />} />
          <Route path="/category" element={<CategoryManagement />} />
          <Route path="/brand" element={<BrandManagement />} />
          <Route path="/inventory" element={<InventoryManagement />} />
          <Route path="*" element={<Navigate to="/list" replace />} />
        </Routes>
      </AppLayout>
    </ConfigProvider>
  );
};

export default App; 