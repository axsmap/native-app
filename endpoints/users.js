import handleEndpoint from './handle-endpoint';

export async function editUserEndpoint(userId, data) {
  return handleEndpoint({ method: 'put', url: `/users/${userId}`, data });
}

export async function getUsersEndpoint(params) {
  return handleEndpoint({ method: 'get', url: '/users', params });
}

export async function getUserEndpoint(userId) {
  return handleEndpoint({ method: 'get', url: `/users/${userId}` });
}
