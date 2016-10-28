import React, { Component } from 'react';
import moment from 'moment';
import './Edge.css';
class Edge extends Component {
  constructor(props) {
    super(props);
  }
  

  render() {
    const {id, oper, time, points} = this.props.data;
    const timeLabel = moment.unix(time).format('YY/MM/DD | hh:mm:ss');
    const curve = points
      .map(p => `${p.x} ${p.y}`)
      .reduce((pre, curr, index, arr) => index % 2 ? `${pre} Q ${curr}` : `${pre} ${curr}`, 'M');
    let operTextPath = `<textPath href="#${id}" direction="ltr" startOffset="50%"><tspan dy="-5">${oper}</tspan></textPath>`;
    let timeTextPath = `<textPath href="#${id}" direction="ltr" startOffset="50%"><tspan dy="15">${timeLabel}</tspan></textPath>`;

    // <text dangerouslySetInnerHTML={{ __html: textPath }}></text>;
    return (
      <g className="graph-edge">
        <path id={id} d={curve} fill="transparent" stroke="#000000" strokeWidth="1" ></path>
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: operTextPath }} />
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: timeTextPath }} />
      </g>
    );
  }
}

export default Edge;