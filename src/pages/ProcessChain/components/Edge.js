import React, { Component } from 'react';
import moment from 'moment';
class Edge extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const {id, src: p0, dest: p2, oper, time, points} = this.props.data;
    const d = `M${p0.x} ${p0.y} ${p2.x} ${p2.y}`;
    const [foo,,bar] = points;
    const d1 =  `M${foo.x} ${foo.y} ${bar.x} ${bar.y}`;
    const timeLabel = moment.unix(time).format('YY/MM/DD | hh:mm:ss');

    let path = 'M';
    points.forEach(p=>{path+=`${p.x} ${p.y} `}) ;

    let operTextPath = `<textPath href="#${id}" direction="ltr" startOffset="50%"><tspan dy="-5">${oper}</tspan></textPath>`;
    let timeTextPath = `<textPath href="#${id}" direction="ltr" startOffset="50%"><tspan dy="15">${timeLabel}</tspan></textPath>`;
    // <text dangerouslySetInnerHTML={{ __html: textPath }}></text>;
    return (
      <g>
        <path id={id} d={path} fill="transparent" stroke="#000000" strokeWidth="1" ></path>
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: operTextPath }} />
        <text textAnchor="middle" dangerouslySetInnerHTML={{ __html: timeTextPath }} />
      </g>
    );
  }
}

export default Edge;