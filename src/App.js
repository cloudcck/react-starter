import React, {Component} from 'react';
import {Banner, Navbar, Footer} from './components/common';
import TodoPage from './components/todo/TodoPage';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Banner />
        <Navbar />
        <div className="app-container">
          Hello world !
          <i className="fa fa-fw fa-question"></i>

          <TodoPage />
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;