import React, { Component } from 'react';

class Vertex extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    const {label, width: w, height: h, x, y} = this.props.data;
    return (
      <g>
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill="gray"/>
        <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{label}</text>
      </g>
    );
  }
}

export default Vertex;