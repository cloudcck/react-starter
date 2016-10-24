import React, { Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import _ from 'lodash'
import JSONTree from 'react-json-tree'

import { fetchRemoteData } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
import { transferDataToGraphEdgeAndVertex } from './lib/ProcessChainLib';

class ProcessChain extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.fetchRemoteData('xxx', 'ooo');
  }
  render() {
    const {edges, vertexes} = transferDataToGraphEdgeAndVertex(this.props.chains);
    return (
      <div>
        <JSONTree data={this.props.chains} />
        {
          <svg width="100%" height="600px">
            <g>
              {
                edges.map(e => <Edge key={e.id} data={e} />)
              }
              {
                vertexes.map(n => <Vertex key={n.id} data={n} />)
              }
            </g>
          </svg>
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps = {}) => {
  return {
    chains: state.getIn(['rcpc', 'chains'], new Map()).toJS(),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRemoteData: (tasiId, agentId) => {
      dispatch(fetchRemoteData(tasiId, agentId));
    }
  };
}


const ProcessChainPage = connect(mapStateToProps, mapDispatchToProps)(ProcessChain);
export default ProcessChainPage;