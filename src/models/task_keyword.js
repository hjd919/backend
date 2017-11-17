import { queryTask, saveTask, getFreeMobileNum } from '../services/task';
import { removeRule, addRule } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'task_keyword',

  state: {
   
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryTask, payload);
      yield put({
        type: 'fetchSuccess',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    fetchSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
