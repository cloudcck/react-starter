import { combineReducers } from 'redux-immutable';
import  todoState from './pages/todo/reducers';
import  footprintState from './pages/footprint/redux/reducers';
import rcpc from './pages/SimpeRootCauseChain/redux/reducer'

const appStrore = combineReducers({
  todoState,footprintState,rcpc
});

export default appStrore;
