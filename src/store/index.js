import { createStore, applyMiddleware } from 'redux';
import {Map} from 'immutable';
import createLogger from 'redux-logger';
import todoApp  from '../reducers';

// reducer, initialState, enhancer
let preloadedState = Map();
const logger = createLogger();
let store = createStore(todoApp, preloadedState, applyMiddleware(logger));
export default store;