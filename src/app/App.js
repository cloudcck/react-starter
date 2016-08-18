import React, {Component} from 'react';
import {Banner, Navbar, Footer} from './common';
import { DashboardPage, AdministrationPage, AboutPage, TodoPage } from '../pages';

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