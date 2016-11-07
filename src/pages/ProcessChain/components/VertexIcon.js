import React, { PureComponent } from 'react';

class VertexIcon extends PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    let {x, y, r, objType, fillColor} = this.props.data;
    const objTypeMapping = {
      0: 'X',
      1: 'F',
      2: 'P',
      3: 'M',
      4: 'S',
      5: 'U',
      6: 'I',
      7: 'D',
      8: 'S',
      9: 'W',
      10: 'F',
      11: 'I',
      12: 'U',
      13: 'I',
      14: 'R',
      15: 'A',
      16: 'M',
      17: 'S'
    }

    return (
      <g>
        <circle cx={x} cy={y} r={r} strokeWidth="2" stroke={fillColor} fill="none" />
        <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y} fill={fillColor}>{objTypeMapping[objType]}</text>
      </g>
    );
  }
}

export default VertexIcon;