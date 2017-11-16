import { queryTask, saveTask, getFreeMobileNum } from '../services/task';
import { removeRule, addRule } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'task',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    form: {
      task_id: 0,
      keywords: {},
      free_mobile_num: 0
    },
    loading: true,
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
    *save({ payload }, { call, put }) {
      const response = yield call(saveTask, payload);

      yield put({
        type: 'saveSuccess',
        payload: response.task_id,
      });

      yield put(routerRedux.push('/task/step_add_task/step2'));
    },
    *getFreeMobileNum({ }, { call, put }) {
      const response = yield call(getFreeMobileNum);

      yield put({
        type: 'getFreeMobileNumSuccess',
        payload: response.free_mobile_num,
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
    getFreeMobileNumSuccess(state, action) {
      return {
        ...state,
        form: {
          free_mobile_num: action.payload
        },
      };
    },
    saveSuccess(state, action) {
      return {
        ...state,
        form: {
          task_id: action.payload
        },
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
