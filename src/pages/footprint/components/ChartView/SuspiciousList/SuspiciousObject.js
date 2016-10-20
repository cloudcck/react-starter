import React, { Component } from 'react';
import './SuspiciousObject.css'
class SuspiciousObject extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let arr = [];
    let key = 0;
    this.props.metas.map(id => {
      arr.push(this.props.refMeta[id]);
    });
    return (
      <div>
        {
          arr.map(e => <div key={key++} className="suspicious-object">
            <span>{e.type}</span><span>{e.value}</span>
          </div>)
        }
      </div>
    );
  }
}

export default SuspiciousObject;