import React from 'react';
import { Layout, Menu, Typography, theme } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  AppstoreOutlined,
  EditOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

const { Content, Sider } = Layout;
const { Title } = Typography;

// 定义菜单项
const menuItems = [
  {
    key: '/product/list',
    icon: <ShoppingOutlined />,
    label: '商品列表',
  },
  {
    key: '/product/category',
    icon: <AppstoreOutlined />,
    label: '类目管理',
  },
  {
    key: '/product/edit',
    icon: <EditOutlined />,
    label: '商品编辑',
  },
  {
    key: '/product/inventory',
    icon: <DatabaseOutlined />,
    label: '库存管理',
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  // 从当前路径获取选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    
    // 特殊处理编辑页面
    if (path.startsWith('/product/edit/')) {
      return '/product/edit';
    }
    
    return path;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 只有在独立运行时才显示侧边栏，在微前端中由主应用提供导航 */}
      {!window.__POWERED_BY_WUJIE__ && (
        <Sider
          theme="light"
          width={200}
          style={{ borderRight: `1px solid ${token.colorBorderSecondary}` }}
        >
          <div style={{ padding: '16px', textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>商品管理系统</Title>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
      )}
      <Layout>
        <Content style={{ margin: '24px 16px', padding: 24, background: token.colorBgContainer }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 