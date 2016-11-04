import React, { Component } from 'react';
import VertexFn from './VertexFn';
import { OBJECT_TYPE, META } from '../ProcessChainDef'
import VertexIcon from './VertexIcon';
import './Vertex.css';

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
    const fillColor = _.get(this.props.data, 'detail.isMatched', false) ? 'red' : 'gray';
    const {width: w, height: h, x, y, id, detail: {objectType: objType}, label} = this.props.data;
    let [x0, x1, y0, y1] = [x - w / 2, x + w / 2, y - h / 2, y + h / 2];
    let displayLabel = _.trunc(label, 12);
    const radius = 10;
    const functions = [
      // { label: 'p', color: 'red', bindFn: this.getParent },
      // { label: 'c', color: 'green', bindFn: this.getChild },
      // { label: 's', color: 'yellow', bindFn: this.toggleSize },
      { label: 'x', color: 'gray', bindFn: this.hideVertex }
    ];

    return (
      <g >
        <g className="graph-vertex" onClick={() => this.props.showNodeDetail(id)} onDoubleClick={(e) => this.doubleClickHandler(e)}>
          <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={radius} ry={radius} stroke={fillColor} />
          <text className="vertex-title" textAnchor="start" alignmentBaseline="central" x={x - w / 2 + 30} y={y} fill={fillColor}>{displayLabel}</text>
          <VertexIcon data={{ x: x - w / 2 + 15, y, r: 10, objType: objType, fillColor }} />
        </g>
        {functions.map(f =>
          <VertexFn key={f.label} setting={Object.assign({}, f, { x: x1, y: y0, w: 10, h: 10, vertexId: id })} />
        )}
      </g>
    );
  }
}
export default Vertex;