import React, {Component} from 'react';
import {Banner, Navbar, Footer} from './common';
import { DashboardPage, AdministrationPage, AboutPage, TodoPage } from './pages';
import './Root.css';

class Root extends Component {
  render() {
    return (
      <div>
        <Banner />
        <Navbar />
         {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default Root;

/*
<div className="app-container">
          <TodoPage />
          <AboutPage />
          <AdministrationPage />
          <DashboardPage />
        </div>
*/
