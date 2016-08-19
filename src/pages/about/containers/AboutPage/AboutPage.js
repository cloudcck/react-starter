import React, {Component} from 'react';

class AboutPage extends Component {
  render() {
    return (
      <div>
        This is AboutPage
        <hr/>
        <pre>{JSON.stringify(this.props.params, null, 2) }</pre>
      </div>
    );
  }
}

export default AboutPage;