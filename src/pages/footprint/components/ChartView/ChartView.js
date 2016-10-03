import React, {Component} from 'react';
import SvgContent from './SvgContent';

class ChartView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
  
    return (
      <div>
        <div id="aside">Aside</div>
        <div id="chain-selector">Chain selector</div>
        <SvgContent processChain={this.props.processChain}/>
        <div id="process-detail">process detail</div>
      </div>
    );
  }
}

export default ChartView;