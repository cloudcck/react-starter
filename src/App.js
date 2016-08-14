import React, {Component} from 'react';
import Banner from './components/Banner';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import TodoPage from './components/TodoPage';

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