import { List,fromJS } from 'immutable';
import uuid from 'uuid';
import { combineReducers } from 'redux-immutable';
import { SET_VISIBILITY_FILTER, VisibilityFilters, ADD_TODO, TOGGLE_TODO } from '../actions';

const todos = (state = List(), action) => {
  switch (action.type) {
    case ADD_TODO:
      return state.push(fromJS({
        id:uuid.v4(),
        text:action.text,
        completed:false
      }));
    case TOGGLE_TODO:
      return state.map(todo => {
        if (todo.id === action.id) {
          todo.completed = !todo.completed;
        };
        return todo;
      })
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

const todoApp = combineReducers({
  visibilityFilter,
  todos
});

export default todoApp;