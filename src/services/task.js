import { requestAuthApi } from '../utils/request';

export async function queryTask(params) {
  return requestAuthApi('/backend/task/query', { query: params });
}

export async function saveTask(params) {
  return requestAuthApi('/backend/task/save', {
    method: 'POST',
    body: params,
  });
}

export async function getFreeMobileNum() {
  return requestAuthApi('/backend/task/getFreeMobileNum');
}

export async function saveTaskKeyword(params) {
  return requestAuthApi('/backend/task/saveTaskKeyword', {
    method: 'POST',
    body: params,
  });
}

export async function queryTaskKeyword(params) {
  return requestAuthApi('/backend/task_keyword/query', { query: params });
}