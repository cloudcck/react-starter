import { combineReducers } from 'redux-immutable';
import  todoState from './pages/todo/reducers';
import  footprintState from './pages/footprint/reducers';


const appStrore = combineReducers({
  todoState,footprintState
});

export default appStrore;
