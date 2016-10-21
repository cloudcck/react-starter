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
    edgesep: 60, // decrease up to down space in UL align
    ranksep: 60, // 50	Number of pixels between each rank in the layout . in LR dir, decrease space
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
    const {id:s,latestTimeSlotFromSrc:s1,firstTimeSlotFromDest:s2} = srcVertex;
    const {id:d,latestTimeSlotFromSrc:d1,firstTimeSlotFromDest:d2} = destVertex;
    const srcSlotKey = _.size(srcVertex.src) ? s2: s1;
    const destSlotKey = _.size(destVertex.dest) ? d2:d1;
    
    const i1 = _.indexOf(timeSlots,s1);
    const i2 = _.indexOf(timeSlots,s2);
    const i3 = _.indexOf(timeSlots,d1);
    const i4 = _.indexOf(timeSlots,d2);

    const srcIndex = _.indexOf(timeSlots,srcSlotKey);
    const destIndex = _.indexOf(timeSlots,destSlotKey);
    let length = destIndex - srcIndex;
    length = length < 1 ? 1 :length;
    console.log(`${s} : ${s1} - ${i1}, ${s2} -> ${i2}\n${d} : ${d1} - ${i3}, ${d2} -> ${i4}\n${s} to ${d} ====> ${length}`);
    return  length;
  }


  _.forEach(vertexes, (d) => {
    let {id: srcId} = d;
    console.log('--------------------------------------', srcId);
    graph.setNode(srcId, Object.assign({}, d, SIZE.MAX));
    if (_.size(d.dest)) {
      _.forEach(d.dest, (obj, destId) => {
        if (!graph.hasNode(destId)) {
          graph.setNode(destId, Object.assign({}, { destId, label: _.get(vertexes[destId], 'label', destId) }, SIZE.MAX));
        }
        // console.log(`${srcId} , ${destId},${vertexes[srcId].latestTimeSlotFromSrc}, ${vertexes[destId].latestTimeSlotFromSrc}, ${vertexes[destId].firstTimeSlotFromDest}`)
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


