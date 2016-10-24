import React, { Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import _ from 'lodash'
import JSONTree from 'react-json-tree'

import { fetchRemoteData } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
class SimpleRootCauseChain extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.fetchRemoteData('xxx', 'ooo');
  }
  render() {
    let graph = createGraph();
    updateLayoutFromState(graph, this.props.chains);
    const {edges, vertexes} = transfer(graph);
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


const SimpleRootCauseChainPage = connect(mapStateToProps, mapDispatchToProps)(SimpleRootCauseChain);
export default SimpleRootCauseChainPage;


///////
const createGraph = () => {
  const GRAPH_SETTING = {
    rankdir: 'LR',
    align: 'UL',
    // nodesep: 60, // decrease up to down space in UL align
    edgesep: 20, // decrease up to down space in UL align
    ranksep: 20, // 50	Number of pixels between each rank in the layout . in LR dir, decrease space
    marginx: 10,
    marginy: 10
  };
  let graph = new dagre.graphlib.Graph({ multigraph: true, directed: true, compound: false });
  graph.setGraph(GRAPH_SETTING);
  graph.setDefaultEdgeLabel(() => { return {}; });
  return graph;
}

const updateLayoutFromState = (graph, chains) => {

  const SIZE = {
    MAX: { width: 60, height: 30 },
    MIN: { width: 40, height: 30 },
  };

  const COLOR = {
    DANGER: 'red',
    NORMAL: 'gray',
    NONE: 'white',
    HIGHTLIGHT: 'yellow',
  };
  const {vertexes, timeSlots} = chains;
  console.warn(JSON.stringify(timeSlots));

  const countMinLength = (srcVertex, destVertex) => {
    // const timeToKey = (time) => { moment.unix(time).format('YYYY-MM-DD') };
    const {id: s, ts0: s_ts0, ts1: s_ts1} = srcVertex;
    const {id: d, ts0: d_ts0, ts1: d_ts1} = destVertex;
    const i1 = _.indexOf(timeSlots, s_ts0);
    const i2 = _.indexOf(timeSlots, s_ts1);
    const i3 = _.indexOf(timeSlots, d_ts0);
    const i4 = _.indexOf(timeSlots, d_ts1);
    const srcIndex = i1;
    const destIndex = i4;
    console.log(`${s} : ${s_ts0} - ${i1}, ${s_ts1} -> ${i2}`);
    console.log(`${d} : ${d_ts0} - ${i3}, ${d_ts1} -> ${i4}`);

    let length = destIndex - srcIndex;
    length = length < 1 ? 1 : length;

    console.log(`${s} to ${d} ====> ${length}`);
    return length;
  }


  _.forEach(vertexes, (d) => {
    let {id: srcId} = d;
    graph.setNode(srcId, Object.assign({}, d, SIZE.MAX));
    if (_.size(d.dest)) {
      _.forEach(d.dest, (obj, destId) => {
        if (!graph.hasNode(destId)) {
          graph.setNode(destId, Object.assign({}, { destId, label: _.get(vertexes[destId], 'label', destId) }, SIZE.MAX));
        }
        let minlen = countMinLength(vertexes[srcId], vertexes[destId]);
        minlen = minlen < 1 ? 1 : minlen;
        graph.setEdge(srcId, destId, { name: obj.oper, time: obj.operTime, minlen });
      })
    }
  })
  dagre.layout(graph);
}

const transfer = (graph) => {
  let vertexes = graph.nodes().map(n => { return graph.node(n) });
  let edges = graph.edges().map(e => {
    const {x: srcX, y: srcY} = graph.node(e.v);
    const {x: destX, y: destY} = graph.node(e.w);
    const {name: oper, time: operTime} = graph.edge(e);
    return {
      id: `${e.v}_${graph.edge(e).name}_${e.w}`,
      src: { x: srcX, y: srcY },
      dest: { x: destX, y: destY },
      oper, operTime
    }
  });
  return { vertexes, edges };
}


