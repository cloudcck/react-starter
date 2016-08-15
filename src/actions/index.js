import fetch from 'isomorphic-fetch';
import moment from 'moment';
/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO';
export const INIT_TODOS = 'INIT_TODOS';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

/*
 * action creators
 */
export function initTodos(todos) {
  return { type: INIT_TODOS, todos };
}



export function addTodo(text) {
  return { type: ADD_TODO, text }
}

export function toggleTodo(id) {
  return { type: TOGGLE_TODO, id }
}

export function setVisibilityFilter(filter) {
  return { type: SET_VISIBILITY_FILTER, filter }
}



/*
 * Asnc actions 
 */
export function fetchTodosFromApi() {
  return (dispatch, getState) => {
    let url = '/api/todos';
    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(json => dispatch(receiveTodosFromServer(json.Data, moment().utc().unix())))
  };
}

export const RECEIVE_TODOS_FROM_API = 'RECEIVE_TODOS_FROM_API';
export function receiveTodosFromServer(todos, receiveTime) {
  return {
    type: RECEIVE_TODOS_FROM_API,
    todos,
    receiveTime
  }
}