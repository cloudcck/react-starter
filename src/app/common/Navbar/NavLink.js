import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';
class NavLink extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Link {...this.props} activeClassName="active-link" ></Link>
    );
  }
}
export default NavLink;

