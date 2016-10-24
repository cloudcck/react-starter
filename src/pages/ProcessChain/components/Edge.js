import React, {Component} from 'react';

class Edge extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const data = this.props.data;
    const define = `M${data.src.x} ${data.src.y} ${data.dest.x} ${data.dest.y}`;
    return (
      <path data-id={data.id} d={define} fill="transparent" stroke="#000000" strokeWidth="1" ></path>
    );
  }
}

export default Edge;