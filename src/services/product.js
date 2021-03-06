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
export async function queryTrendingProducts() {
  return request('/api/v1/products/trending');
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
export async function updateSale(params) {
  return request('/api/v1/products/updateSale', {
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

export async function addNftOrder(params) {
  return request('/api/v1/asset/addNftOrder', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function queryNftOrders(params) {
  return request('/api/v1/asset/nftOrders', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function updateOrders(params) {
  return request('/api/v1/asset/updateNftOrder', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}