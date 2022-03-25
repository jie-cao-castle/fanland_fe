import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryTopProduct() {
  return request('/api/v1/products/top');
}

