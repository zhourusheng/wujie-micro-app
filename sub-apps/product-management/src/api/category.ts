import request from './request';

export interface CategoryItem {
  id: string | number;
  name: string;
  parentId: number;
  sort?: number;
  icon?: string;
}

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/categories',
    method: 'get'
  });
}

// 创建分类
export function createCategory(data: Omit<CategoryItem, 'id'>) {
  return request({
    url: '/categories',
    method: 'post',
    data
  });
}

// 更新分类
export function updateCategory(id: string | number, data: Partial<CategoryItem>) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data
  });
}

// 删除分类
export function deleteCategory(id: string | number) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  });
} 