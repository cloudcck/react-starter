import React, { Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import _ from 'lodash'
import JSONTree from 'react-json-tree'

import { fetchRemoteData, getMore, getParent, getChild } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
import { transferDataToGraphEdgeAndVertex } from './ProcessChainLib';

class ProcessChain extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    let {taskId, agentId} = this.props.routeParams;
    this.props.fetchRemoteData(taskId, agentId);
  }
  render() {
    const {edges, vertexes} = transferDataToGraphEdgeAndVertex(this.props.chains);
    return (
      <div>
        <button onClick={() => { } }>Get More</button>
        <JSONTree data={this.props.chains} />
        {
          <svg width="100%" height="600px">
            <defs>
              <marker id="path_start" markerWidth="4" markerHeight="4" refX="2" refY="2" viewBox="0 0 4 4" orient="auto"><circle r="1" cx="2" cy="2" fill="gray"></circle></marker>
              <marker id="path_end" markerWidth="12" markerHeight="12" refX="6" refY="6" viewBox="0 0 12 12" orient="auto"><path d="M-6 0L6 6L-6 12 " fill="gray"></path></marker>
            </defs>
            <g>
              {
                edges.map(e => <Edge key={e.id} data={e} />)
              }
              {
                vertexes.map(n => <Vertex key={n.id} data={n} getParent={this.props.getParent} getChild={this.props.getChild} />)
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
    },
    getParent: (tasiId, agentId, objectId) => {
      dispatch(getParent(tasiId, agentId, objectId));
    },
    getChild: (tasiId, agentId, objectId) => {
      dispatch(getChild(tasiId, agentId, objectId));
    },
    getMore: () => {
      dispatch(getMore(tasiId, agentId));
    }
  };
}


const ProcessChainPage = connect(mapStateToProps, mapDispatchToProps)(ProcessChain);
export default ProcessChainPage;