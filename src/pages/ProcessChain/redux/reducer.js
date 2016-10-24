import { SAVE_REMOVE_DATA } from './action';
import { List, Map, fromJS, toJS } from 'immutable';
import { combineReducers } from 'redux-immutable';

import {normailze} from './lib/normalize';

const chains = (state = new Map(), action) => {
  switch (action.type) {
    case SAVE_REMOVE_DATA:
      state = fromJS( normailze(action.processes));
      return state;
    default:
      return state;
  }
}

export default combineReducers({
  chains
})
