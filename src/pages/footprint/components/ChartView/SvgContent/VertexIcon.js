import React, {Component} from 'react';

class VertexIcon extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {id, title, height, width, x, y, type} = this.props.data;
    const r = 10;
    const cx = x + r - width / 2;
    return (
      <g className="vertex-icon">
        <circle r={r} cx={cx} cy={y} fill="gray"></circle>
        <text textAnchor="middle" alignmentBaseline="central" x={cx} y={y}>{type}</text>
      </g>
    );
  }
}

export default VertexIcon;