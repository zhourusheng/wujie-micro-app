import request from './request';

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

// 获取库存记录
export function getInventoryRecords(params: InventoryQueryParams) {
  return request({
    url: '/inventory/records',
    method: 'get',
    params
  });
}

// 入库操作
export function stockIn(data: {
  productId: string | number;
  quantity: number;
  remark?: string;
}) {
  return request({
    url: '/inventory/in',
    method: 'post',
    data
  });
}

// 出库操作
export function stockOut(data: {
  productId: string | number;
  quantity: number;
  remark?: string;
}) {
  return request({
    url: '/inventory/out',
    method: 'post',
    data
  });
}

// 批量入库
export function batchStockIn(data: Array<{
  productId: string | number;
  quantity: number;
  remark?: string;
}>) {
  return request({
    url: '/inventory/batch-in',
    method: 'post',
    data
  });
}

// 批量出库
export function batchStockOut(data: Array<{
  productId: string | number;
  quantity: number;
  remark?: string;
}>) {
  return request({
    url: '/inventory/batch-out',
    method: 'post',
    data
  });
}

// 获取库存预警列表
export function getStockWarningList(params: { page: number; pageSize: number }) {
  return request({
    url: '/inventory/warnings',
    method: 'get',
    params
  });
}

// 设置库存预警阈值
export function setStockWarningThreshold(data: {
  productId: string | number;
  threshold: number;
}) {
  return request({
    url: '/inventory/threshold',
    method: 'post',
    data
  });
}

// 导出库存记录
export function exportInventoryRecords(params: Partial<InventoryQueryParams>) {
  return request({
    url: '/inventory/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
} 