import request from './request';
import { mockCategories } from './mock';

export interface CategoryItem {
  id: string | number;
  name: string;
  parentId: number;
  level?: number;
  sort?: number;
  icon?: string;
  children?: CategoryItem[];
}

// 获取分类列表
export function getCategoryList() {
  // 使用模拟数据替代实际请求
  return Promise.resolve(mockCategories);
}

// 创建分类
export function createCategory(data: Omit<CategoryItem, 'id'>) {
  // 模拟创建分类
  const newCategory = {
    ...data,
    id: Math.max(...mockCategories.map(c => Number(c.id))) + 1
  };
  mockCategories.push(newCategory as CategoryItem);
  return Promise.resolve({ success: true });
}

// 更新分类
export function updateCategory(id: string | number, data: Partial<CategoryItem>) {
  // 模拟更新分类
  const index = mockCategories.findIndex(c => c.id === Number(id));
  if (index !== -1) {
    mockCategories[index] = { ...mockCategories[index], ...data };
  }
  return Promise.resolve({ success: true });
}

// 删除分类
export function deleteCategory(id: string | number) {
  // 模拟删除分类
  const index = mockCategories.findIndex(c => c.id === Number(id));
  if (index !== -1) {
    mockCategories.splice(index, 1);
  }
  return Promise.resolve({ success: true });
} 