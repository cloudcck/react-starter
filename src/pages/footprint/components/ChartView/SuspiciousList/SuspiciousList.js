import React, { Component } from 'react';
import SuspiciousObject from './SuspiciousObject';
import './SuspiciousList.css'
class SuspiciousList extends Component {
  constructor(props) {
    super(props);
    this.toggleShow = this.toggleShow.bind(this);
  }

  componentWillMount() {
    this.state = {
      show: true
    }
  }

  toggleShow(){
    console.log(this.state.show,'--->',!this.state.show);
    this.setState({show:!this.state.show});
  }

  render() {
    let index = 0;
    const cs = this.state.show ? 'show-list' : 'hide-list';
    console.log('cs =>',cs);
    return (
      <div id="aside-section">
        <div id="suspicious-list" className={cs}>
          {this.props.list.map(p => <div key={index++}><SuspiciousObject refMeta={this.props.meta} metas={p.metas} /></div>)}
        </div>
        <div onClick={()=>{this.toggleShow()}}>{this.state.show?'xx':'oo'}</div>
      </div>
    );
  }
}

export default SuspiciousList;