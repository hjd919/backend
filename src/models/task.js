import { queryTask, saveApp } from '../services/task';
import { removeRule, addRule } from '../services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'task',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    task: {
      ios_app_id:0,
      keywords:{},
      data:{}
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
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *saveApp({ payload }, { call, put }) {
      const response = yield call(saveApp, payload);

      yield put({
        type: 'saveAppSuccess',
        payload: response.ios_app_id,
      });

      yield put(routerRedux.push('/task/step_add_task/step2'));
    },
    *add({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });

      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAppSuccess(state, action) {
      return {
        ...state,
        task: {
          ios_app_id: action.payload
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
