import { queryAccount } from '@/services/user';
import { deployContract, connectContract, queryChainId, getETHtoUSDprice } from '@/services/nft';
import MetaMaskOnboarding from '@metamask/onboarding';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

export default {
  namespace: 'eth',
  state: {
    accounts: [],
    contract: undefined,
    chainId: undefined,
    usdPrice: undefined,
  },

  effects: {
    *fetchAccounts(_, { call, put }) {
      try {
          const response = yield call(queryAccount);
          yield put({
              type: 'saveAccounts',
              payload: response,
          });
          console.log(response)
      } catch(error) {
          console.log(error)
      }
    },

    *deployContract({ payload, callback }, { call, put }) {
      try {
        const response = yield call(deployContract, payload);
        yield put({
            type: 'saveContract',
            payload: response,
        });
        console.log(response)
        if (callback && typeof callback === 'function') {
          console.log(response)
          callback(response)
        }
      } catch(error) {
        console.log(error)
      }
    },

    *queryChainId({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryChainId, payload);
        yield put({
            type: 'saveChainId',
            payload: response,
        });
        console.log(response)
        if (callback && typeof callback === 'function') {
          console.log(response)
          callback(response)
        }
      } catch(error) {
        console.log(error)
      }
    },

    *connectContract({ payload, callback }, { call, put }) {
      try {
        const response = yield call(connectContract, payload);
        yield put({
            type: 'saveContract',
            payload: response,
        });
        if (callback && typeof callback === 'function') {
          callback(response)
        }
      } catch(error) {
        console.log(error)
      }
    },
    *fetchETHtoUSDprice({ payload, callback }, { call, put }) {
      const response = yield call(getETHtoUSDprice, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
      yield put({
        type: 'saveETHPrice',
        payload: response,
      });
    },
  },

  

  reducers: {
    saveAccounts(state, action) {
    console.log(action.payload)
      return {
        ...state,
        accounts: action.payload,
      };
    },
    saveContract(state, action) {
      console.log(action.payload)
        return {
          ...state,
          contract: action.payload,
        };
      },
      saveChainId(state, action) {
        console.log(action.payload)
          return {
            ...state,
            chainId: parseInt(action.payload, 16),
          };
      },
      saveETHPrice(state, action) {
        console.log(action.payload)
          return {
            ...state,
            usdPrice: parseInt(action.payload["USD"], 10),
          };
      },
  },
};
