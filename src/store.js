import { createStore, applyMiddleware } from 'redux';
import {Map} from 'immutable';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import appStore  from './reducer';

// reducer, initialState, enhancer
let preloadedState = Map();
const logger = createLogger();
let store = createStore(appStore, preloadedState, applyMiddleware(thunkMiddleware,logger));
export default store;
