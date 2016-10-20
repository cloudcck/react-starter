import React, {Component} from 'react';
import VertexIcon from './VertexIcon';
import VertexBackground from './VertexBackground';
import VertexTitle from './VertexTitle';
class Vertex extends Component {
  constructor(props) {
    super(props);
  }
  showProcessDetail(e){
    this.props.showProcessDetail(e.target)
  }
  render() {
    const {id,title,height,width,x,y} = this.props.data;
    const r = 10;    
    return (
      <g className="vertex" onClick={(e)=>this.props.showProcessDetail(e)}>
        <VertexBackground data={this.props.data}/>
        <VertexIcon data={this.props.data} />
        <VertexTitle data={this.props.data} />
      </g>
    );
  }
}

export default Vertex;



