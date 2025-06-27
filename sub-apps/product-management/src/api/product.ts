import request from './request';

// 商品类型定义
export interface ProductItem {
  id: string | number;
  name: string;
  categoryId: string | number;
  categoryName?: string;
  price: number;
  status: 0 | 1; // 0-下架，1-上架
  stock: number;
  images: string[];
  description: string;
  specs?: Record<string, string>; // 商品规格参数
  createdAt?: string;
  updatedAt?: string;
}

// 查询参数类型
export interface ProductQueryParams {
  keyword?: string;
  categoryId?: string | number;
  status?: 0 | 1;
  page: number;
  pageSize: number;
}

// 分页结果类型
export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取商品列表
export function getProductList(params: ProductQueryParams) {
  return request({
    url: '/products',
    method: 'get',
    params
  });
}

// 获取商品详情
export function getProductDetail(id: string | number) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  });
}

// 创建商品
export function createProduct(data: Omit<ProductItem, 'id'>) {
  return request({
    url: '/products',
    method: 'post',
    data
  });
}

// 更新商品
export function updateProduct(id: string | number, data: Partial<ProductItem>) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  });
}

// 删除商品
export function deleteProduct(id: string | number) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  });
}

// 批量删除商品
export function batchDeleteProducts(ids: (string | number)[]) {
  return request({
    url: '/products/batch',
    method: 'delete',
    data: { ids }
  });
}

// 商品上下架
export function changeProductStatus(id: string | number, status: 0 | 1) {
  return request({
    url: `/products/${id}/status`,
    method: 'patch',
    data: { status }
  });
}

// 批量导入商品
export function importProducts(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request({
    url: '/products/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 导出商品数据
export function exportProducts(params: Partial<ProductQueryParams>) {
  return request({
    url: '/products/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
} 