import request from './request';
import { mockProducts, paginateData, searchProducts, getProductById } from './mock';

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
  // 使用模拟数据而不是实际请求
  const filtered = searchProducts(params.keyword, params.categoryId, params.status);
  return Promise.resolve(paginateData(filtered, params.page, params.pageSize));
}

// 获取商品详情
export function getProductDetail(id: string | number) {
  // 使用模拟数据
  const product = getProductById(id);
  return Promise.resolve({ data: product });
}

// 创建商品
export function createProduct(data: Omit<ProductItem, 'id'>) {
  // 模拟创建商品
  const newProduct = {
    ...data,
    id: mockProducts.length + 1
  };
  mockProducts.push(newProduct as ProductItem);
  return Promise.resolve({ success: true });
}

// 更新商品
export function updateProduct(id: string | number, data: Partial<ProductItem>) {
  // 模拟更新商品
  const index = mockProducts.findIndex(item => item.id === Number(id));
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...data };
  }
  return Promise.resolve({ success: true });
}

// 删除商品
export function deleteProduct(id: string | number) {
  // 模拟删除商品
  const index = mockProducts.findIndex(item => item.id === Number(id));
  if (index !== -1) {
    mockProducts.splice(index, 1);
  }
  return Promise.resolve({ success: true });
}

// 批量删除商品
export function batchDeleteProducts(ids: (string | number)[]) {
  // 模拟批量删除
  ids.forEach(id => {
    const index = mockProducts.findIndex(item => item.id === Number(id));
    if (index !== -1) {
      mockProducts.splice(index, 1);
    }
  });
  return Promise.resolve({ success: true });
}

// 商品上下架
export function changeProductStatus(id: string | number, status: 0 | 1) {
  // 模拟状态切换
  const index = mockProducts.findIndex(item => item.id === Number(id));
  if (index !== -1) {
    mockProducts[index].status = status;
  }
  return Promise.resolve({ success: true });
}

// 批量导入商品
export function importProducts(file: File) {
  // 模拟导入，什么都不做
  return Promise.resolve({ success: true });
}

// 导出商品数据
export function exportProducts(params: Partial<ProductQueryParams>) {
  // 模拟导出
  return Promise.resolve({ 
    data: new Blob(['模拟的导出数据'], { type: 'application/vnd.ms-excel' })
  });
} 