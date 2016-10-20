import React, { Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import _ from 'lodash'

import { fetchRemoteData } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
class SimpleRootCauseChain extends Component {

  componentWillMount() {
    this.props.fetchRemoteData('xxx', 'ooo');
    let graph = createGraph();
    let data = createData();
    updateLayout(graph, data);
    this.state = transfer(graph);
  }
  render() {
    const {edges, vertexes} = this.state;
    return (
      <div>
        {JSON.stringify(this.props.chains)}<hr />
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
  console.log('state.toJS()', state.toJS());
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

const createData = () => {
  let t1 = moment('20110101-01:11:11', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t2 = moment('20120201-02:22:22', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t3 = moment('20130401-03:33:33', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t4 = moment('20140501-04:44:44', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t5 = moment('20150501-05:55:55', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t6 = moment('20150501-06:06:06', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let t7 = moment('20150501-07:07:07', 'YYYYMMDD-HH:mm:ss').utc().unix();
  let oper1 = { oper: 1, operTime: t1 };
  let oper2 = { oper: 1, operTime: t2 };
  let oper3 = { oper: 1, operTime: t3 };
  let oper4 = { oper: 1, operTime: t4 };
  let oper5 = { oper: 1, operTime: t4 };
  let oper6 = { oper: 1, operTime: t6 };
  let oper7 = { oper: 1, operTime: t7 };
  let data = {
    1: {
      id: 1,
      label: 'A',
      froms: {},
      tos: { 4: oper1 },
      tsIndex: 0
    },
    2: {
      id: 2,
      label: 'B',
      froms: {},
      tos: { 4: oper2 },
      tsIndex: 1
    },
    3: {
      id: 3,
      label: 'C',
      froms: {},
      tos: { 4: oper3 },
      tsIndex: 2
    },
    4: {
      id: 4,
      label: 'D',
      froms: { 1: oper1, 2: oper2, 4: oper3 },
      tos: { 5: oper5 },
      tsIndex: 3
    },
    5: {
      id: 5,
      label: 'E',
      froms: { 4: oper4 },
      tos: { 6: oper6, 7: oper7 },
      tsIndex: 4
    },
    6: {
      id: 6,
      label: 'F',
      froms: { 5: oper6 },
      tos: {},
      tsIndex: 5
    },
    7: {
      id: 7,
      label: 'G',
      froms: { 5: oper7 },
      tos: {},
      tsIndex: 5
    }
    // ,
    // 8: {
    //   id: 8,
    //   label: 'X',
    //   froms: {},
    //   tos: { 9: oper4 },
    //   tsIndex: 3
    // },
    // 9: {
    //   id: 9,
    //   label: 'Y',
    //   froms: { 8: oper4 },
    //   tos: { 5: oper5 },
    //   tsIndex: 5
    // },
  }
  return data;

}

const updateLayout = (graph, data) => {
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

  _.forEach(data, (d) => {
    console.log('--------------------------------------', d.id);
    graph.setNode(d.id, Object.assign({}, d, SIZE.MAX));
    if (_.size(d.tos)) {
      console.log('for tos');
      _.forEach(d.tos, (obj, id) => {
        if (!graph.hasNode(id)) {
          console.log(`${id} not exists`);
          graph.setNode(id, Object.assign({}, { id, label: _.get(data[id], 'label', id) }, SIZE.MAX));
        } else {
          console.log(`${id}  exists`);
        }

        let minlen = data[id].tsIndex - data[d.id].tsIndex;
        minlen = minlen < 1 ? 1 : minlen;
        console.log('---------->', d.id, id, obj.oper, minlen);
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