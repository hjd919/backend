import { requestAuthApi } from '../utils/request';

export async function queryTask(params) {
  return requestAuthApi('/backend/task/query', {query: params});
}