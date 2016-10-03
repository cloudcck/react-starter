import React, {Component} from 'react';

class VertexTitle extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {title, id, x, y, width: w} = this.props.data;
    const r = 10;
    const cx = x - w / 2 + r * 2;
    return (
      <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{title}</text>
    );
  }
}

export default VertexTitle;