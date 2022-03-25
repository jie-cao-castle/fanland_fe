import { queryTopProduct } from '@/services/product';

export default {
  namespace: 'product',

  state: {
    topProduct: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchTopProduct(_, { call, put }) {
      const response = yield call(queryTopProduct);
      yield put({
        type: 'saveTopProduct',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTopProduct(state, action) {
        console.log(action)
        return {
          ...state,
          topProduct: action.payload.result,
        };
      },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
