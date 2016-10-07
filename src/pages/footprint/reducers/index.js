import { combineReducers } from 'redux-immutable';
import footprints from './footprints';
import displayView from './displayView';
export default combineReducers({
  footprints, displayView
})