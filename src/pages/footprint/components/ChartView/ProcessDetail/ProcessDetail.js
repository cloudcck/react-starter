import React, { Component } from 'react';

class ProcessDetail extends Component {
  constructor(props) {
    super(props);
  }

  renderDetail(id) {
    console.log('render detail ')
    return (
      <div>
        {JSON.stringify(id)}
      </div>
    );
  }
  renderEmpty() {
    return (
      <div>
        please click process to show detail
      </div>
    )
  }
  render() {

    const id = this.props.process;
    console.log('render detail ', id);
    if (id) {
      return (
        <div>
          {JSON.stringify(id)}
        </div>
      )
    } else {
      return (
        <div>
          please click process to show detail
      </div>
      )
    }
  }
}

export default ProcessDetail;