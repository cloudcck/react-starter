import React, {Component} from 'react';

class VertexBackground extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const {id, title, height:h, width:w, x, y} = this.props.data;
    return (
       <rect className="vertex-background" 
       data-id={id} width={w} height={h} 
       fill="white" 
       strokeOpacity="1" 
       stroke="gray" 
       strokeWidth="1" 
       rx="10" 
       ry="10" 
       x={x-w/2} y={y-h/2}></rect>
    );
  }
}

export default VertexBackground;