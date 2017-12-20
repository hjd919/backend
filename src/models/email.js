import { getTodayEmailNum } from '../services/task';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'email',

  state: {
    today_email_num: 0,
  },

  effects: {
    *getTodayEmailNum({ payload }, { call, put }) {
      const response = yield call(getTodayEmailNum, payload)

      yield put({
        type: 'getTodayEmailNumSuccess',
        payload: response.today_email_num,
      });
    },
  },

  reducers: {
    getTodayEmailNumSuccess(state, action) {
      return {
        ...state,
        today_email_num: action.payload,
      };
    },
  },
};
