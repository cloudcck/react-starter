import React, {Component} from 'react';
import { IndexLink } from 'react-router';
import NavLink from './NavLink';
class Navbar extends Component {
  render() {
    return (
      <div className="app-navbar">
        <ul>
          <li><NavLink to="/" onlyActiveOnIndex={true}>Home</NavLink></li>
          <li><NavLink to="/todos">Todo</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/about/aaa/bbb/ccc">About-params</NavLink></li>
          <li><NavLink to="/administration" >Administration</NavLink></li>
          <li><NavLink to="/administration/accounts" >Accounts</NavLink></li>
          <li><NavLink to="/administration/proxy"    >Proxy</NavLink></li>
          <li><NavLink to="/administration/console"  >Console</NavLink></li>
        </ul>
      </div>
    );
  }
}

export default Navbar;