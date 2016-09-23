import { combineReducers } from 'redux-immutable';
import  {todos,visibilityFilter} from './pages/todo/reducers';

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;
