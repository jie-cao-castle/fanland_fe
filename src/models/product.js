import { queryTopProduct, 
        createProduct, 
        getProduct,
        queryProductContracts, 
        createProductContract } from '@/services/product';

import { connectContract } from '@/services/nft';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
export default {
  namespace: 'product',

  state: {
    topProduct: {},
    productDetails:{},
    productContracts:[]
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
      *createContract({ payload }, { call, put }) {
        console.log(payload)
        const response = yield call(createProductContract, payload);
        if (response && response.success) {
        yield put({
            type: 'saveContract',
            payload: response,
          });
        }
      },

      *queryContract({ payload }, { call, put }) {
        try {
        const response = yield call(connectContract, payload);
        console.log(response)
        } catch(error) {
          console.log(error);

        }
      },
    *fetchTopProduct(_, { call, put }) {
      const response = yield call(queryTopProduct);
      yield put({
        type: 'saveTopProduct',
        payload: response,
      });
    },
    *fetchProductContracts({ payload, callback }, { call, put }) {
      const response = yield call(queryProductContracts, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
      yield put({
        type: 'saveContracts',
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
      saveContracts(state, action) {
        return {
          ...state,
          productContracts: action.payload.result,
        };
      },
      saveContract(state, action) {
        return {
          ...state,
          productContracts: [action.payload.result]
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
