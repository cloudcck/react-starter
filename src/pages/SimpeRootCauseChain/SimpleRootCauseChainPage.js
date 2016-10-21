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
    nodesep: 25, // decrease up to down space in UL align
    edgesep: 25, // decrease up to down space in UL align
    ranksep: 60, // 50	Number of pixels between each rank in the layout . in LR dir, decrease space
    marginx: 40,
    marginy: 40
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


  const countMinLength = (src, dest, xxxx) => {
    console.log('timeSlots', JSON.stringify(timeSlots));
    console.log(`src:${src} , dest: ${dest} ,dest2: ${xxxx}`);
    const fromIndex = _.indexOf(timeSlots, src);
    const toIndex1 = _.indexOf(timeSlots, dest);
    const toIndex2 = _.indexOf(timeSlots, xxxx);
    console.log(`fromIndex: ${fromIndex}, toIndex1:${toIndex2}, toIndex1:${toIndex2}`);
    const length1 = toIndex1 - fromIndex;
    const length2 = toIndex2 - fromIndex;
    return length1 > length2 ? length1 : length2;
  }


  _.forEach(vertexes, (d) => {
    console.log('--------------------------------------', d.id);
    graph.setNode(d.id, Object.assign({}, d, SIZE.MAX));
    if (_.size(d.dest)) {
      _.forEach(d.dest, (obj, id) => {
        if (!graph.hasNode(id)) {
          graph.setNode(id, Object.assign({}, { id, label: _.get(vertexes[id], 'label', id) }, SIZE.MAX));
        }
        console.log(`${d.id} , ${id},${vertexes[d.id].latestTimeSlotFromSrc}, ${vertexes[id].latestTimeSlotFromSrc}, ${vertexes[id].firstTimeSlotFromDest}`)
        let minlen = countMinLength(vertexes[d.id].latestTimeSlotFromSrc, vertexes[id].latestTimeSlotFromSrc, vertexes[id].firstTimeSlotFromDest);
        minlen = minlen < 1 ? 1 : minlen;
        console.log('---------->', d.id, id, obj.oper, minlen);
        console.log(`${d.id} -> ${id} minlen=${minlen}`)
        graph.setEdge(d.id, id, { name: obj.oper, time: obj.operTime, minlen });
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


