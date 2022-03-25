import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/v1/user/current');
}

export async function queryAccount() {
  return ethereum.request({
    method: 'eth_requestAccounts',
  });
}

export async function loginUser(params) {
  return request('/api/v1/user/login', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
