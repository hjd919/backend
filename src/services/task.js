import { requestAuthApi } from '../utils/request';

export async function queryTask(params) {
  return requestAuthApi('/backend/task/query', { query: params });
}

export async function saveApp(params) {
  return requestAuthApi('/backend/app/saveApp', {
    method: 'POST',
    body: params,
  });
}
