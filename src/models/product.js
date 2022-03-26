import { queryTopProduct, createProduct, getProduct } from '@/services/product';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
export default {
  namespace: 'product',

  state: {
    topProduct: {},
    productDetails:{},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProduct, payload);
      yield put({
        type: 'saveDetails',
        payload: response,
      });
    },

    *create({ payload }, { call, put }) {
        const response = yield call(createProduct, payload);
        if (response && response.success) {
        yield put(routerRedux.push({
            pathname: '/product/details',
            search: stringify({
              id:response.result.Id,
            }),
          }));
        }
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
    saveDetails(state, action) {
      return {
        ...state,
        productDetails: action.payload.result,
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
