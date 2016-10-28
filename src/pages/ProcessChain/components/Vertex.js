import React, { Component } from 'react';
class Vertex extends Component {
  constructor(props) {
    super(props);
    this.getParent = this.getParent.bind(this);
    this.getChild = this.getChild.bind(this);
  }

  getParent(event) {
    console.log('getParent:',this.props.data.id);
    this.props.getParent('aaa','bbb',this.props.data.id);
  }
  getChild(event) {
    console.log('getChild:', this.props.data.id);
    this.props.getChild('ccc','ddd',this.props.data.id);
  }

  render() {
    const {label, width: w, height: h, x, y} = this.props.data;
    const x0 = x - w / 2;
    const x1 = x + w / 2;
    const y0 = y - h / 2;
    const y1 = y + h / 2;
    const fileColor = _.includes(['_D', 'K', 'L', 'W', 'X', 'Z'], this.props.data.id) ? 'red' : 'gray';
    const radius = 10;
    return (
      <g className="graph-vetex">
        <g className="" onClick={(e) => { this.getParent(e); } } >
          <rect x={x0-10} y={y0} width={10} height={10} fill="green"/>
          <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x0-5} y={y0+5}>+</text>
        </g>
        <g>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={radius} ry={radius} fill={fileColor} />
          <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{label}</text>
        </g>
        <g onClick={(e) => { this.getChild(e); } } >
          <rect x={x1} y={y0} width={10} height={10} fill="yellow" />
          <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x1+5} y={y0+5}>+</text>
        </g>
      </g>
    );
  }
}

export default Vertex;