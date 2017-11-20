import { queryTask, saveTask, getFreeMobileNum, saveTaskKeyword } from '../services/task';
import { routerRedux } from 'dva/router';
import { message } from 'antd';

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
      free_mobile_num: 0,
      usable_brush_num: 10000,
    },
    success_keyword_list: [],
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
    *getFreeMobileNum({  }, { call, put, select }) {
      const task_id = yield select(state => state.task.form.task_id);
      const response = yield call(getFreeMobileNum, {task_id});

      yield put({
        type: 'getFreeMobileNumSuccess',
        payload: {
          free_mobile_num: response.free_mobile_num,// 可以打的量
          usable_brush_num: response.usable_brush_num,// 可以打的量
        },
      });
    },
    *saveTaskKeyword({ payload }, { call, put }) {
      const response = yield call(saveTaskKeyword, payload);
      const { error_code, message } = response
      if (error_code) {
        message.error(message)
        return false;
      }

      yield put({
        type: 'saveTaskKeywordSuccess',
        payload: { app_id: response.app_id, keyword: response.keyword, app_name: response.app_name },
      });
      return { message }
    }
  },

  reducers: {
    saveUsableBrushNum(state, action) {
      return {
        ...state,
        form: {
          ...state.form,
          usable_brush_num: action.payload
        },
      };
    },
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
          ...state.form,
          ...action.payload
        },
      };
    },
    saveTaskKeywordSuccess(state, action) {
      return {
        ...state,
        success_keyword_list: state.success_keyword_list.concat(action.payload)
      }
    },
    saveSuccess(state, action) {
      return {
        ...state,
        form: {
          ...state.form,
          task_id: action.payload,
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
