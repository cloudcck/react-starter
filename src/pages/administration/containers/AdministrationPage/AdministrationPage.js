import React, {Component} from 'react';
import { Accounts, ProxySetting, WebConsoleSetting } from '../index.js';
class AdministrationPage extends Component {
  render() {
    return (
      <div>
      AdministrationPage
        <hr/>     
         {this.props.children}
      </div>
    );
  }
}

export default AdministrationPage;