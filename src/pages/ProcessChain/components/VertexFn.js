import React, { Component } from 'react';

class VertexFn extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {x, y, w, h, label, color, vertexId} = this.props.setting;
    return (
      <g className="graph-vertex-fn" onClick={() => this.props.setting.bindFn(vertexId)}>
        <rect x={x} y={y} width={w} height={h} fill={color} />
        <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x + w / 2} y={y + h / 2}>{label}</text>
      </g>
    );
  }
}

export default VertexFn;