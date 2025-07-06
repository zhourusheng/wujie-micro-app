import request from './request';
import { mockInventory } from './mock';
import { mockProducts } from './mock';

// 库存记录类型定义
export interface InventoryRecord {
  id: string | number;
  productId: string | number;
  productName: string;
  type: 'in' | 'out'; // in-入库，out-出库
  quantity: number;
  remainingStock: number;
  operator: string;
  remark?: string;
  createdAt: string;
}

// 库存查询参数
export interface InventoryQueryParams {
  productId?: string | number;
  productName?: string;
  type?: 'in' | 'out';
  startDate?: string;
  endDate?: string;
  page: number;
  pageSize: number;
}

// 模拟库存记录数据
const mockInventoryRecords: InventoryRecord[] = [
  {
    id: 1,
    productId: 1,
    productName: '华为 Mate 60 Pro',
    type: 'in',
    quantity: 100,
    remainingStock: 200,
    operator: '管理员',
    remark: '初始入库',
    createdAt: '2023-10-01 10:00:00'
  },
  {
    id: 2,
    productId: 1,
    productName: '华为 Mate 60 Pro',
    type: 'in',
    quantity: 50,
    remainingStock: 150,
    operator: '管理员',
    remark: '补充库存',
    createdAt: '2023-10-05 14:30:00'
  },
  {
    id: 3,
    productId: 2,
    productName: 'iPhone 15 Pro',
    type: 'in',
    quantity: 150,
    remainingStock: 150,
    operator: '管理员',
    createdAt: '2023-10-02 09:15:00'
  },
  {
    id: 4,
    productId: 1,
    productName: '华为 Mate 60 Pro',
    type: 'out',
    quantity: 30,
    remainingStock: 170,
    operator: '销售员',
    remark: '销售出库',
    createdAt: '2023-10-10 11:20:00'
  },
  {
    id: 5,
    productId: 2,
    productName: 'iPhone 15 Pro',
    type: 'out',
    quantity: 20,
    remainingStock: 130,
    operator: '销售员',
    remark: '销售出库',
    createdAt: '2023-10-12 15:40:00'
  }
];

// 获取库存记录
export function getInventoryRecords(params: InventoryQueryParams) {
  // 过滤并模拟分页
  let result = [...mockInventoryRecords];
  
  if (params.productId) {
    result = result.filter(r => r.productId === Number(params.productId));
  }
  
  if (params.productName) {
    result = result.filter(r => r.productName.includes(params.productName!));
  }
  
  if (params.type) {
    result = result.filter(r => r.type === params.type);
  }
  
  const total = result.length;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = result.slice(start, end);
  
  return Promise.resolve({
    list: paginatedData,
    total,
    page: params.page,
    pageSize: params.pageSize
  });
}

// 入库操作
export function stockIn(data: {
  productId: string | number;
  quantity: number;
  remark?: string;
}) {
  // 模拟入库操作
  const productIndex = mockProducts.findIndex(p => p.id === Number(data.productId));
  if (productIndex !== -1) {
    mockProducts[productIndex].stock += data.quantity;
    
    // 添加一条入库记录
    mockInventoryRecords.push({
      id: mockInventoryRecords.length + 1,
      productId: data.productId,
      productName: mockProducts[productIndex].name,
      type: 'in',
      quantity: data.quantity,
      remainingStock: mockProducts[productIndex].stock,
      operator: '当前用户',
      remark: data.remark,
      createdAt: new Date().toLocaleString()
    });
  }
  
  return Promise.resolve({ success: true });
}

// 出库操作
export function stockOut(data: {
  productId: string | number;
  quantity: number;
  remark?: string;
}) {
  // 模拟出库操作
  const productIndex = mockProducts.findIndex(p => p.id === Number(data.productId));
  if (productIndex !== -1) {
    mockProducts[productIndex].stock = Math.max(0, mockProducts[productIndex].stock - data.quantity);
    
    // 添加一条出库记录
    mockInventoryRecords.push({
      id: mockInventoryRecords.length + 1,
      productId: data.productId,
      productName: mockProducts[productIndex].name,
      type: 'out',
      quantity: data.quantity,
      remainingStock: mockProducts[productIndex].stock,
      operator: '当前用户',
      remark: data.remark,
      createdAt: new Date().toLocaleString()
    });
  }
  
  return Promise.resolve({ success: true });
}

// 批量入库
export function batchStockIn(data: Array<{
  productId: string | number;
  quantity: number;
  remark?: string;
}>) {
  // 模拟批量入库
  data.forEach(item => {
    stockIn(item);
  });
  
  return Promise.resolve({ success: true });
}

// 批量出库
export function batchStockOut(data: Array<{
  productId: string | number;
  quantity: number;
  remark?: string;
}>) {
  // 模拟批量出库
  data.forEach(item => {
    stockOut(item);
  });
  
  return Promise.resolve({ success: true });
}

// 获取库存预警列表
export function getStockWarningList(params: { page: number; pageSize: number }) {
  // 过滤库存低于警戒值的商品
  const warningList = mockInventory.filter(item => item.totalStock <= item.warningThreshold);
  
  const total = warningList.length;
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = warningList.slice(start, end);
  
  return Promise.resolve({
    list: paginatedData,
    total,
    page: params.page,
    pageSize: params.pageSize
  });
}

// 设置库存预警阈值
export function setStockWarningThreshold(data: {
  productId: string | number;
  threshold: number;
}) {
  // 模拟设置库存预警阈值
  const index = mockInventory.findIndex(item => item.productId === Number(data.productId));
  if (index !== -1) {
    mockInventory[index].warningThreshold = data.threshold;
  }
  
  return Promise.resolve({ success: true });
}

// 导出库存记录
export function exportInventoryRecords(params: Partial<InventoryQueryParams>) {
  // 模拟导出
  return Promise.resolve({
    data: new Blob(['模拟的库存记录导出数据'], { type: 'application/vnd.ms-excel' })
  });
} 