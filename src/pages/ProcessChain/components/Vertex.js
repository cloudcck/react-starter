import React, { Component } from 'react';
import VertexFn from './VertexFn';

class Vertex extends Component {
  constructor(props) {
    super(props);
    this.getParent = this.getParent.bind(this);
    this.getChild = this.getChild.bind(this);
  }

  getParent(event) {
    console.log('getParent:', this.props.data.id);
    this.props.getParent('aaa', 'bbb', this.props.data.id);
  }
  getChild(event) {
    console.log('getChild:', this.props.data.id);
    this.props.getChild('ccc', 'ddd', this.props.data.id);
  }
  toggleSize(id) {
    console.log('toggle size of ', id);
  }
  toggleHidden(id) {
    console.log('toggle hidden of ', id);
  }

  render() {
    const fileColor = _.includes(['_D', 'K', 'L', 'W', 'X', 'Z'], this.props.data.id) ? 'red' : 'gray';
    const {label, width: w, height: h, x, y, id} = this.props.data;
    let [x0, x1, y0, y1] = [x - w / 2, x + w / 2, y - h / 2, y + h / 2];

    const radius = 10;
    const functions = [
      { label: 'p', color: 'red', bindFn: this.getParent },
      { label: 'c', color: 'green', bindFn: this.getChild },
      { label: 's', color: 'yellow', bindFn: this.toggleSize },
      { label: 'h', color: 'gray', bindFn: this.toggleHidden }
    ];

    return (
      <g className="graph-vetex">
        <g>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={radius} ry={radius} fill={fileColor} />
          <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{label}</text>
        </g>
        {functions.map(f => <VertexFn key={f.label} setting={Object.assign({}, f, { x: x0 += 10, y: y0 - 10, w: 10, h: 10, vertexId: id })} />)}
      </g>
    );
  }
}
export default Vertex;