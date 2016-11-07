import dagre from 'dagre';
import { GRAPH_SETTING, SIZE, COLOR } from './ProcessChainConfig';
import moment from 'moment';
const countMinLength = (timeSlots, srcVertex, destVertex) => {
  // const timeToKey = (time) => { moment.unix(time).format('YYYY-MM-DD') };
  // console.log('timeSlots :', timeSlots);
  const {id: s, ts0: s_ts0, ts1: s_ts1} = srcVertex;
  const {id: d, ts0: d_ts0, ts1: d_ts1} = destVertex;
  const i1 = _.indexOf(timeSlots, s_ts0);
  const i2 = _.indexOf(timeSlots, s_ts1);
  const i3 = _.indexOf(timeSlots, d_ts0);
  const i4 = _.indexOf(timeSlots, d_ts1);
  const srcIndex = _.size(srcVertex.src) ? i2 : i1;
  // const srcIndex = i1;
  const destIndex = i4;
  let length = destIndex - srcIndex;
  length = length < 1 ? 1 : length;
  // console.log(`${s} to ${d} ===> ${length}\n\t${s} : ${s_ts0} - ${i1}, ${s_ts1} -> ${i2}\n\t${d} : ${d_ts0} - ${i3}, ${d_ts1} -> ${i4}`);
  return length;
}


const notHidden = (hiddenNodes, nodeId) => {
  return !hiddenNodes.includes(nodeId);
}

const recursive = (vertexes, timeKeys, rootVertex, parentVertex, nodes, edges, isVirtual, hiddenNodes) => {
  // console.log('resurcive ', rootVertex.id, parentVertex.id, nodes.length, edges.length);
  if (_.isEmpty(parentVertex.dest)) {
    return { nodes, edges };
  } else {
    _.forEach(parentVertex.dest, (opers, wId) => {
      let w = vertexes[wId];
      if (notHidden(hiddenNodes, wId)) {
        nodes.push(w);
        _.forEach(opers, operation => {
          let {oper, timestamp: time} = operation;
          let edgeId = `${rootVertex.id}_${oper}_${time}_${wId}`;
          edges.push({
            v: rootVertex.id,
            w: wId,
            name: edgeId,
            id: edgeId,
            minlen: countMinLength(timeKeys, parentVertex, w),
            oper,
            time,
            virtual: isVirtual
          });
        });
      } else {
        const {nodes: _n, edges: _e} = recursive(vertexes, timeKeys, rootVertex, w, nodes, edges, true, hiddenNodes);
        nodes = _.union(nodes, _n);
        edges = _.union(edges, _e);
      }
    })
  }
  return { nodes, edges };
}
const generateTimeKeys = (vertexes, hiddenNodes) => {
  let timeKeys = [];
  _.forEach(vertexes, (v, id) => {
    if (notHidden(hiddenNodes, id)) {
      timeKeys = _.union(timeKeys, [moment.unix(v.t0).format('YYYY-MM-DD'), moment.unix(v.t1).format('YYYY-MM-DD')])
    }
  })
  return timeKeys.sort();
}

const setEdgeAndNode = (graph, vertexes, hiddenNodes = []) => {
  const timeKeys = generateTimeKeys(vertexes, hiddenNodes);
  _.forEach(vertexes, (v, vId) => {
    if (notHidden(hiddenNodes, vId)) {
      graph.setNode(vId, Object.assign({}, v, SIZE.MAX));
      const {nodes, edges} = recursive(vertexes, timeKeys, v, v, [], [], false, hiddenNodes);
      _.forEach(nodes, (n) => { graph.setNode(n.id, Object.assign({}, n, SIZE.MAX)); });
      _.forEach(edges, (e) => { graph.setEdge({ v: e.v, w: e.w, name: e.name }, { id: e.id, minlen: e.minlen, oper: e.oper, time: e.time, virtual: e.virtual }) });
    }
  });
  dagre.layout(graph);
}




const transfer = (graph, chains) => {
  const {objects, metaData } = chains;
  let vertexes = graph.nodes().map(n => { return Object.assign({}, graph.node(n), _.get(objects, n)) });
  let edges = graph.edges().map(e => {
    const {x: srcX, y: srcY} = graph.node(e.v);
    const {x: destX, y: destY} = graph.node(e.w);
    const {id, oper, time, points, virtual} = graph.edge(e);
    return {
      id, oper, time, points, virtual,
      src: { id: e.v, x: srcX, y: srcY },
      dest: { id: e.w, x: destX, y: destY }
    }
  });
  return { graph, vertexes, edges };
}

export const transferDataToGraphEdgeAndVertex = (chains, hiddenNodes) => {
  console.log('hidden nodes:', JSON.stringify(hiddenNodes));
  let {objects: vertextes, metaData} = chains;
  let graph = new dagre.graphlib.Graph({ multigraph: true, directed: true, compound: false });
  graph.setGraph(GRAPH_SETTING);
  graph.setDefaultEdgeLabel(() => { return {}; });
  setEdgeAndNode(graph, vertextes, hiddenNodes);
  return transfer(graph, chains);
}


