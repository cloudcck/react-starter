import React, {Component} from 'react';
import { Map, fromJS, toJS } from 'immutable';
import { connect } from 'react-redux';
import {fetchFootprintsFromServer, toggleView, CHART_VIEW, TABLE_VIEW} from '../actions';
import ChartView from '../components/ChartView';
import TableView from '../components/TableView';
import _ from 'lodash';
class FootprintPage extends Component {
  constructor(props) {
    super(props);
    this.handleToggleView = this.handleToggleView.bind(this);
  }
  componentDidMount() {
    this.props.fetchFootprintsFromServer('foo', 'bar');

  }
  handleToggleView(view) {
    this.props.toggleView(view);
  }
  render() {
    const footprints = this.props.footprints;
    const displayView = this.props.displayView;
    const View = displayView === TABLE_VIEW ? TableView : ChartView;
    return (
      <div>
        <button onClick={() => this.handleToggleView(TABLE_VIEW) }>TABLE_VIEW</button>
        <button onClick={() => this.handleToggleView(CHART_VIEW) }>CHART_VIEW</button>
        <View serverMeta={footprints.serverMeta} processChain={footprints.processChain}/>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps = {}) => {
  console.log('state.toJS()', state.toJS());
  return {
    footprints: state.getIn(['footprintState', 'footprints'], new Map()).toJS(),
    displayView: state.getIn(['footprintState', 'displayView'], 'xxxxx')
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFootprintsFromServer: (tasiId, agentId) => {
      dispatch(fetchFootprintsFromServer(tasiId, agentId));
    },
    toggleView: (view) => {
      dispatch(toggleView(view));
    }
  };
}

FootprintPage = connect(mapStateToProps, mapDispatchToProps)(FootprintPage);
export default FootprintPage;
