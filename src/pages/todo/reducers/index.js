import { List, fromJS } from 'immutable';
import uuid from 'uuid';
import { combineReducers } from 'redux-immutable';
import { SET_VISIBILITY_FILTER, VisibilityFilters, ADD_TODO, TOGGLE_TODO, INIT_TODOS, RECEIVE_TODOS_FROM_API} from '../actions';

const todos = (state = List(), action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.push(fromJS({
        id: uuid.v4(),
        text: action.text,
        completed: false
      }));
    case TOGGLE_TODO:
      return state.map(todo => {

        if (todo.get('id') === action.id) {
          let updated = todo.toJS();
          updated.completed = !updated.completed;
          todo = fromJS(updated);

          // TODO not workded in immutable API
          // todo.update('completed',(val=false)=>!val);

          // TODO not workded too.
          // todo.update('completed',false,val=>!val);
        };
        return todo;
      });
    case INIT_TODOS:
      return fromJS(action.todos);
    case RECEIVE_TODOS_FROM_API:
    console.log('action.receiveTime ',action.receiveTime);
      return fromJS(action.todos);
    default:
      return state;
  }
}

const visibilityFilter = (state = VisibilityFilters.SHOW_ALL, action) => {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}
const todoState = combineReducers({
  todos,visibilityFilter
})

export default todoState;
