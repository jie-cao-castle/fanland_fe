import { queryAccount } from '@/services/user';
import MetaMaskOnboarding from '@metamask/onboarding';

const { isMetaMaskInstalled } = MetaMaskOnboarding;

export default {
  namespace: 'eth',
  state: {
    accounts: [],
  },

  effects: {
    *fetchAccounts(_, { call, put }) {
        const response = yield call(queryAccount);
        yield put({
            type: 'saveAccounts',
            payload: response,
        });
        console.log(response)
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
  },
};
