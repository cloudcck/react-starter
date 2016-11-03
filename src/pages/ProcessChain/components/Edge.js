import React, { Component } from 'react';
import moment from 'moment';
import './Edge.css';

import { OPERATION } from '../ProcessChainDef'
class Edge extends Component {
  constructor(props) {
    super(props);
  }
  createTextPath(hrefId, dy, label) {
    return `<textPath href="#${hrefId}" direction="ltr" startOffset="50%"><tspan dy=${dy}>${label}</tspan></textPath>`;
  }
  render() {
    const {id, oper, time, points, virtual, dest: {y: minY}} = this.props.data;
    const operTextPath = this.createTextPath(id, -3, OPERATION[oper]);
    const timeTextPath = this.createTextPath(id, 10, moment.unix(time).format('YYYY/MM/DD|hh:mm'));
    const strokeDasharray = virtual ? '5,5' : '0';
    const curve = points
      .map(p => `${p.x} ${p.y}`)
      .reduce((pre, curr, i) => i % 2 ? `${pre} Q ${curr}` : `${pre} ${curr}`, 'M');
    return (
      <g className="graph-edge">
        <path id={id} d={curve}
          fill="transparent"
          stroke="#000000"
          strokeWidth="1"
          strokeDasharray={strokeDasharray}
          markerStart="url(#path_start)"
          markerEnd="url(#path_end)"></path>
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: operTextPath }} />
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: timeTextPath }} />
      </g>
    );
  }
}

export default Edge;