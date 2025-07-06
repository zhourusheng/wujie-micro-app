// 模拟数据

import { ProductItem } from './product';
import { CategoryItem } from './category';

// 商品分类模拟数据
export const mockCategories: CategoryItem[] = [
  { id: 1, name: '电子产品', parentId: 0, level: 1, sort: 1, children: [] },
  { id: 2, name: '服装', parentId: 0, level: 1, sort: 2, children: [] },
  { id: 3, name: '食品', parentId: 0, level: 1, sort: 3, children: [] },
  { id: 4, name: '家居', parentId: 0, level: 1, sort: 4, children: [] },
  { id: 11, name: '手机', parentId: 1, level: 2, sort: 1, children: [] },
  { id: 12, name: '电脑', parentId: 1, level: 2, sort: 2, children: [] },
  { id: 13, name: '相机', parentId: 1, level: 2, sort: 3, children: [] },
  { id: 21, name: '男装', parentId: 2, level: 2, sort: 1, children: [] },
  { id: 22, name: '女装', parentId: 2, level: 2, sort: 2, children: [] },
];

// 商品模拟数据
export const mockProducts: ProductItem[] = [
  {
    id: 1,
    name: '华为 Mate 60 Pro',
    categoryId: 11,
    categoryName: '手机',
    price: 6999,
    status: 1,
    stock: 200,
    images: ['https://img.alicdn.com/imgextra/i1/6000000008078/O1CN01JidlJZ29lBASRBhAv_!!6000000008078-0-octopus.jpg'],
    description: '华为最新旗舰手机，搭载麒麟9000处理器',
    specs: {
      '屏幕尺寸': '6.8英寸',
      '处理器': '麒麟9000',
      '内存': '12GB',
      '存储': '512GB'
    }
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    categoryId: 11,
    categoryName: '手机',
    price: 8999,
    status: 1,
    stock: 150,
    images: ['https://img.alicdn.com/imgextra/i4/O1CN01Tnc8wn1VCeOQypWBx_!!6000000002614-0-yinhe.jpg'],
    description: 'Apple最新旗舰手机，搭载A17处理器',
    specs: {
      '屏幕尺寸': '6.7英寸',
      '处理器': 'A17 Pro',
      '内存': '8GB',
      '存储': '256GB'
    }
  },
  {
    id: 3,
    name: 'MacBook Pro M3 Max',
    categoryId: 12,
    categoryName: '电脑',
    price: 19999,
    status: 1,
    stock: 50,
    images: ['https://img.alicdn.com/imgextra/i1/6000000007776/O1CN01iD6lO625wT89B7lsW_!!6000000007776-0-octopus.jpg'],
    description: 'Apple最新专业笔记本，搭载M3 Max芯片',
    specs: {
      '屏幕尺寸': '16英寸',
      '处理器': 'M3 Max',
      '内存': '64GB',
      '存储': '2TB'
    }
  },
  {
    id: 4,
    name: '联想 ThinkPad X1 Carbon',
    categoryId: 12,
    categoryName: '电脑',
    price: 12999,
    status: 0,
    stock: 30,
    images: ['https://img.alicdn.com/imgextra/i3/6000000007776/O1CN01TEUMIl25wT89B5YzB_!!6000000007776-0-octopus.jpg'],
    description: '联想商务笔记本旗舰，搭载英特尔处理器',
    specs: {
      '屏幕尺寸': '14英寸',
      '处理器': 'Intel Core i7',
      '内存': '16GB',
      '存储': '1TB'
    }
  },
  {
    id: 5,
    name: '佳能 EOS R5',
    categoryId: 13,
    categoryName: '相机',
    price: 24999,
    status: 1,
    stock: 20,
    images: ['https://img.alicdn.com/imgextra/i1/O1CN01OKtdqi21ylVGELiZ1_!!6000000007046-0-yinhe.jpg'],
    description: '佳能全画幅微单相机，8K视频拍摄',
    specs: {
      '传感器': '全画幅CMOS',
      '有效像素': '4500万',
      '连拍速度': '20张/秒',
      '视频规格': '8K 30p'
    }
  }
];

// 库存管理模拟数据
export const mockInventory = mockProducts.map(product => ({
  productId: product.id,
  productName: product.name,
  sku: `SKU${product.id}00${Math.floor(Math.random() * 10)}`,
  totalStock: product.stock,
  availableStock: Math.floor(product.stock * 0.8),
  lockStock: Math.floor(product.stock * 0.1),
  defectiveStock: Math.floor(product.stock * 0.1),
  warningThreshold: Math.floor(product.stock * 0.2),
  updateTime: new Date().toISOString()
}));

// 模拟分页功能
export function paginateData<T>(data: T[], page: number, pageSize: number) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    list: paginatedData,
    total: data.length,
    page,
    pageSize
  };
}

// 模拟搜索功能
export function searchProducts(keyword?: string, categoryId?: number | string, status?: 0 | 1) {
  let filteredProducts = [...mockProducts];
  
  if (keyword) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }
  
  if (categoryId) {
    filteredProducts = filteredProducts.filter(product => 
      product.categoryId === Number(categoryId)
    );
  }
  
  if (status !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.status === status
    );
  }
  
  return filteredProducts;
}

// 模拟获取单个商品详情
export function getProductById(id: string | number) {
  return mockProducts.find(product => product.id === Number(id)) || null;
} 