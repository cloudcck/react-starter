import React, {Component} from 'react';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import {fetchFootprintsFromServer} from '../actions';
import ChartView from '../components/ChartView';
import TableView from '../components/TableView';
import _ from 'lodash';
class FootprintPage extends Component {
  componentDidMount() {
    this.props.fetchFootprintsFromServer('foo', 'bar');
  }
  render() {
    console.log('query -> ', this.props.location.query);
    const view = _.get(this.props, 'location.query.view', 'chart');
    let View = view === 'chart' ? ChartView : TableView;
    return (
      <div>
        This is footprint page <hr />
        <hr />
        <View serverMeta={this.props.footprintState.footprints.serverMeta} processChain={this.props.footprintState.footprints.processChain}/>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    footprintState: state.getIn(['footprintState'], new Map()).toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFootprintsFromServer: (tasiId, agentId) => {
      dispatch(fetchFootprintsFromServer(tasiId, agentId));
    }
  };
}

FootprintPage = connect(mapStateToProps, mapDispatchToProps)(FootprintPage);
export default FootprintPage;
