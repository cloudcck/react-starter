import { INIT_PROCESS_CHAIN_DATA, APPEND_PROCESS_CHAIN_DATA } from './action';
import { List, Map, fromJS, toJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { normailze } from './normalize';

const chains = (state = new Map(), action) => {
  switch (action.type) {
    case INIT_PROCESS_CHAIN_DATA:
      state = fromJS(normailze(action.processes));
      return state;
    case APPEND_PROCESS_CHAIN_DATA:
      let {vertexes, timeSlots} = normailze(action.processes);
      return state
        .mergeDeepIn(['vertexes'], fromJS(vertexes))
        .mergeDeepIn(['timeSlots'], fromJS(timeSlots));
    default:
      return state;
  }
}

export default combineReducers({
  chains
})
