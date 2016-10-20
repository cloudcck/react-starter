import React, { Component } from 'react';
import SvgContent from './SvgContent';
import SuspiciousList from './SuspiciousList/SuspiciousList';
import ProcessDetail from './ProcessDetail/ProcessDetail';
class ChartView extends Component {
  constructor(props) {
    super(props);
    this.showProcessDetail = this.showProcessDetail.bind(this);
  }
  
  componentWillMount() {
    this.state={showDetailProcessId:null};
  }
  
  showProcessDetail(event) {
    const id = event.target.getAttribute('data-id');
    console.log(`show detail of id:${id}`);
    this.setState({showDetailProcessId:id})
  }
  render() {
    console.log('typeof this.props.processChain : ', typeof this.props.processChain)
    const suspiciousList = _.values(this.props.processChain).filter(p => p.suspicious);
    return (
      <div className="row-fluid">
        <div className="row" id="chain-selector">Chain selector</div>
        <div className="row-fluid">
          <div className="col-md-3">
            <SuspiciousList list={suspiciousList} meta={this.props.serverMeta} />
          </div>
          <div className="col-md-6">
            <SvgContent processChain={this.props.processChain} showProcessDetail={this.showProcessDetail}/>
          </div>
          <div className="col-md-3">
            <ProcessDetail process={this.state.showDetailProcessId} />
          </div>
        </div>
      </div>
    );
  }
}

export default ChartView;