import {
  queryTopProduct,
  createProduct,
  createSale,
  getProduct,
  queryProductContracts,
  updateProductContract,
  queryNftOrders,
  addNftOrder,
  updateOrders,
  createProductContract,
  queryTrendingProducts,
  updateSale,
} from '@/services/product';

import { connectContract, setTokenPrice, buyNftwithPrice, getTransaction } from '@/services/nft';
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
export default {
  namespace: 'product',

  state: {
    topProduct: {},
    trendingProducts: [],
    productDetails: {},
    sale: {},
    sales:[],
    productData:{},
    productContracts: [],
    ethContract: undefined,
    nftOrders: [],
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      const response = yield call(getProduct, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
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
            id: response.result.Id,
          }),
        }));
      }
    },

    *createSale({ payload, callback }, { call, put }) {
      const response = yield call(createSale, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
      if (response && response.success) {
        yield put({
          type: 'addSaveSale',
          payload: response,
        });
      }
    },
    *updateSale({ payload, callback }, { call, put }) {
      const response = yield call(updateSale, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
      if (response && response.success) {
        yield put({
          type: 'updateSaveSale',
          payload: response,
        });
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
    *updateContract({ payload }, { call, put }) {
      console.log(payload)
      const response = yield call(updateProductContract, payload);
      if (response && response.success) {
        yield put({
          type: 'saveContract',
          payload: response,
        });
      }
    },

    *queryContract({ payload, callback }, { call, put }) {
      try {
        const response = yield call(connectContract, payload);
        console.log(response)
        if (callback && typeof callback === 'function') {
          callback(response)
        }
        yield put({
          type: 'saveEthContract',
          payload: response,
        });
      } catch (error) {
        console.log(error);
      }
    },

    *setPrice({ payload, callback }, { call, put }) {
      try {
        console.log(payload)
        const response = yield call(setTokenPrice, payload);
        console.log(response)
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      } catch (error) {
        console.log(error);
      }
    },
    *buyNft({ payload, callback }, { call, put }) {
      try {
        const response = yield call(buyNftwithPrice, payload);
        console.log(response)
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      } catch (error) {
        console.log(error);
      }
    },
    *getTrans({ payload, callback }, { call, put }) {
      try {
        const response = yield call(getTransaction, payload);
        console.log(response)
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      } catch (error) {
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

    *fetchTrendingProducts(_, { call, put }) {
      const response = yield call(queryTrendingProducts);
      yield put({
        type: 'saveTrendingProducts',
        payload: response,
      });
    },

    *createNftOrder({ payload, callback }, { call, put }) {
      const response = yield call(addNftOrder, payload);
      yield put({
        type: 'saveNftOrder',
        payload: response,
      });
    },
    *getNftOrders({ payload, callback }, { call, put }) {
      const response = yield call(queryNftOrders, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
      yield put({
        type: 'saveNftOrder',
        payload: response,
      });
    },
    *updateNftOrders({ payload, callback }, { call, put }) {
      const response = yield call(updateOrders, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
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
        productData: action.payload.result.product,
        sales: action.payload.result.sales,
      };
    },
    saveTopProduct(state, action) {
      console.log(action)
      return {
        ...state,
        topProduct: action.payload.result,
      };
    },
    saveTrendingProducts(state, action) {
      return {
        ...state,
        trendingProducts: action.payload.result,
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
    addSaveSale(state, action) {
      const { sales } = state;
      const newData = sales.map(item => ({ ...item }));
      if (action.payload && action.payload.success) {
        const newSale = action.payload.result;
        newData.push(newSale);
      }

      return {
        ...state,
        sales:newData
      };
    },
    updateSaveSale(state, action) {
      const { sales } = state;
      const newData = sales.map(item => ({ ...item }));
      if (action.payload && action.payload.success) {
        const newSale = action.payload.result;
        console.log("newSale", newSale);
        for (let i = 0 ; i < newData.length; i++){
          if (newData[i].Id == newSale.Id) {
            newData[i].Status = newSale.Status;
          }
        }
      }
      return {
        ...state,
        sales:newData
      };
    },
  
    saveSale(state, action) {
      console.log("saveSale", state);
      return {
        ...state,
        sale: action.payload.result
      };
    },
    saveEthContract(state, action) {
      return {
        ...state,
        ethContract: action.payload.result
      };
    },
    saveNftOrder(state, action) {
      console.log("saveNftOrder", state);
      return {
        ...state,
        nftOrders: action.payload.result
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
