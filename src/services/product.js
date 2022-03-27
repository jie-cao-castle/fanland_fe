import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function getProduct(params) {
  return request('/api/v1/products/details', {
      method: 'POST',
      body: {
        ...params,
      },
    });
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
  export async function createSale(params) {
    return request('/api/v1/products/addSale', {
        method: 'POST',
        body: {
          ...params,
        },
      });
  }
  
export async function queryProductContracts(params) {
  return request('/api/v1/asset/contracts', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}
export async function createProductContract(params) {
  return request('/api/v1/asset/addContract', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}

export async function updateProductContract(params) {
  return request('/api/v1/asset/updateContract', {
      method: 'POST',
      body: {
        ...params,
      },
    });
}