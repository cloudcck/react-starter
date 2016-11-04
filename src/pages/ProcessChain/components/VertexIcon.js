import React, { PureComponent } from 'react';

class VertexIcon extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    let {x, y, r, objType, fillColor} = this.props.data;
    return (
      <g>
        <circle cx={x} cy={y} r={r} strokeWidth="2" stroke={fillColor} fill="none" />
        <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{objType}</text>
      </g>
    );
  }
}

export default VertexIcon;