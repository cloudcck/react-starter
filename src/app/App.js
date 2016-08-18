import React, {Component} from 'react';
import {Banner, Navbar, Footer} from './common';

import DashboardPage from '../pages/dashboard/containers/DashboardPage';
import AdministrationPage from '../pages/administration/containers/AdministrationPage';
import AboutPage from '../pages/about/containers/AboutPage';
import TodoPage from '../pages/todo/containers/TodoPage';


class App extends Component {
  render() {
    return (
      <div>
        <Banner />
        <Navbar />
        <div className="app-container">
          <TodoPage />
          <AboutPage />
          <AdministrationPage />
          <DashboardPage />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;