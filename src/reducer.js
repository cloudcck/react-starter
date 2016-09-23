import { combineReducers } from 'redux-immutable';
import  todoState from './pages/todo/reducers';


const appStrore = combineReducers({
  todoState
});

export default appStrore;
