import 'babel-polyfill';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Router, hashHistory, IndexRoute,browserHistory} from 'react-router';
import { DashboardPage, AdministrationPage, AboutPage, TodoPage } from './pages';
import { Accounts, ProxySetting, WebConsoleSetting } from './pages/administration/containers';
import store from './pages/todo/store';

import './index.html';
import App from './app/App';


ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={App} >
        <IndexRoute component={DashboardPage}/>
        <Route path="todos" component={TodoPage}/>
        <Route path="about" component={AboutPage}/>
        <Route path="about/:foo/:bar/:qux" component={AboutPage}/>
        <Route path="administration" component={AdministrationPage}>
          <IndexRoute component={Accounts}/>
          <Route path="accounts" component={Accounts} />
          <Route path="proxy" component={ProxySetting} />
          <Route path="console" component={WebConsoleSetting} />
        </Route>
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
