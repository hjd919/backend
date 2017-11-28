import { queryApp, queryHourlyStat } from '../services/task';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'app',

  state: {
    query_params: {},
    data: {
      list: [],
      pagination: {},
    },
    hourl_stat: {
      list: [],
      pagination: {},
    },
    loading: true,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      // 合并url的查询参数
      const query_params = yield select(state => state.app.query_params);
      payload = { ...payload, ...query_params }

      const response = yield call(queryApp, payload);
      yield put({
        type: 'fetchSuccess',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
    *fetchHourlyStat({ payload }, { call, put, select }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });

      // 合并url的查询参数
      const query_params = yield select(state => state.app.query_params);
      payload = { ...payload, ...query_params }

      const response = yield call(queryHourlyStat, payload);
      yield put({
        type: 'fetchHourlyStatSuccess',
        payload: response,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    }
  },

  reducers: {
    setQueryParams(state, action) {
      return {
        ...state,
        query_params: action.payload,
      };
    },
    fetchSuccess(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    fetchHourlyStatSuccess(state, action) {
      return {
        ...state,
        hourl_stat: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
};
