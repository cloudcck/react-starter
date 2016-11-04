import React, { Component } from 'react';
import VertexFn from './VertexFn';
import { OBJECT_TYPE, META } from '../ProcessChainDef'
class Vertex extends Component {
  constructor(props) {
    super(props);
    this.getParent = this.getParent.bind(this);
    this.getChild = this.getChild.bind(this);
    this.doubleClickHandler = this.doubleClickHandler.bind(this);
    this.hideVertex = this.hideVertex.bind(this);
  }

  getParent(event) {
    console.log('getParent:', this.props.data.id);
    this.props.getParent('aaa', 'bbb', this.props.data.id);
  }
  getChild(event) {
    console.log('getChild:', this.props.data.id);
    this.props.getChild('ccc', 'ddd', this.props.data.id);
  }

  doubleClickHandler(event) {
    const id = this.props.data.id;
    console.log('click handler ctrl:%s, shift:%s, alt:%s, %s', event.ctrlKey,
      event.shiftKey,
      event.altKey, new Date());
    if (event.shiftKey) {
      this.props.toggleHidden(id);
    } else if (event.altKey) {
      this.props.toggleSize(id);
    }

  }
  toggleSize(id) {
    console.log('toggle size of ', id);
  }
  hideVertex(id) {
    console.log('Vertex toggle hidden of ', id);
    this.props.toggleHidden(id);
  }

  render() {
    // console.log(OBJECT_TYPE, META);
    const fileColor = _.get(this.props.data, 'detail.isMatched', false) ? 'red' : 'gray';
    const {width: w, height: h, x, y, id, detail, label} = this.props.data;
    let [x0, x1, y0, y1] = [x - w / 2, x + w / 2, y - h / 2, y + h / 2];
    let displayLabel = _.trunc(label, 10);
    const radius = 10;
    const functions = [
      { label: 'p', color: 'red', bindFn: this.getParent },
      { label: 'c', color: 'green', bindFn: this.getChild },
      { label: 's', color: 'yellow', bindFn: this.toggleSize },
      { label: 'h', color: 'gray', bindFn: this.hideVertex }
    ];

    return (
      <g className="graph-vetex">
        <g onClick={() => this.props.showNodeDetail(id)} onDoubleClick={(e) => this.doubleClickHandler(e)}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={radius} ry={radius} fill={fileColor} />
          <text className="vertex-title" textAnchor="middle" alignmentBaseline="central" x={x} y={y}>{displayLabel}</text>
        </g>
        {functions.map(f => <VertexFn key={f.label} setting={Object.assign({}, f, { x: x0 += 10, y: y0 - 10, w: 10, h: 10, vertexId: id })} />)}
      </g>
    );
  }
}
export default Vertex;