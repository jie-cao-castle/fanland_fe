import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryTopProduct() {
  return request('/api/v1/products/top');
}

export async function createProduct(params) {
    return request('/api/v1/products/add', {
        method: 'POST',
        body: {
          ...params,
        },
      });
  }