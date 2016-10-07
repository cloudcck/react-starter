import React, {Component} from 'react';

class Edge extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const [p1, p2, p3] = this.props.points;
    const define = `M${p1.x} ${p1.y} Q${p2.x} ${p2.y} ${p3.x} ${p3.y}`;
    return (
      <path d={define} fill="transparent" stroke="#000000" strokeWidth="1" markerStart="url(#path_start)" markerEnd="url(#path_end)"></path>
    );
  }
}

export default Edge;