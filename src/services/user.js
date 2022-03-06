import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryAccount() {
  return ethereum.request({
    method: 'eth_requestAccounts',
  });
}
