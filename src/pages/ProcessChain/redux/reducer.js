import { INIT_PROCESS_CHAIN_DATA, APPEND_PROCESS_CHAIN_DATA, HANDLE_NEW_FORMAT_DATA } from './action';
import { List, Map, fromJS, toJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { normailze } from './normalize';
import { normalizeResponse } from './reducerNormalizer'

const chains = (state = new Map(), action) => {
  switch (action.type) {
    case INIT_PROCESS_CHAIN_DATA:
      state = fromJS(normailze(action.processes));
      return state;
    case APPEND_PROCESS_CHAIN_DATA:
      return state
        .mergeDeep(fromJS(normailze(action.processes)))
    case HANDLE_NEW_FORMAT_DATA:
      let a = normalizeResponse(action.data);
      // console.log('--------\n', JSON.stringify(a, '', 2));
      return fromJS(a);
    default:
      return state;
  }
}

export default combineReducers({
  chains
})
