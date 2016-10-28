import dagre from 'dagre';

const GRAPH_SETTING = {
  rankdir: 'LR',
  align: 'UL',
  nodesep: 40, // decrease up to down space in UL align
  edgesep: 40, // decrease up to down space in UL align
  ranksep: 60, // 50	Number of pixels between each rank in the layout . in LR dir, decrease space
  marginx: 50,
  marginy: 50
};
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

const createGraph = () => {

  return graph;
}
const countMinLength = (timeSlots, srcVertex, destVertex) => {
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
  console.log(`${s} to ${d} ===> ${length}\n\t${s} : ${s_ts0} - ${i1}, ${s_ts1} -> ${i2}\n\t${d} : ${d_ts0} - ${i3}, ${d_ts1} -> ${i4}`);
  return length;
}

const setEdgeAndNode = (graph, chains) => {
  const {vertexes, timeSlots} = chains;
  _.forEach(vertexes, (v, vId) => {
    graph.setNode(vId, Object.assign({}, v, SIZE.MAX));
    _.forEach(v.dest, (opers, wId) => {
      let w = vertexes[wId];
      graph.setNode(wId, Object.assign({}, w, SIZE.MAX));
      _.forEach(opers, operation => {
        let {op: oper, t: time} = operation;
        let edgeId = `${vId}_${oper}_${time}_${wId}`;
        graph.setEdge(
          { v: vId, w: wId, name: edgeId },
          { id: edgeId, minlen: countMinLength(timeSlots, v, w), oper, time })
      });
    })
  });
  dagre.layout(graph);
}
const transfer = (graph) => {

  let vertexes = graph.nodes().map(n => { return graph.node(n) });
  let edges = graph.edges().map(e => {
    const {x: srcX, y: srcY} = graph.node(e.v);
    const {x: destX, y: destY} = graph.node(e.w);
    const {id, oper, time, points} = graph.edge(e);
    return {
      id, oper, time, points,
      src: { id: e.v, x: srcX, y: srcY },
      dest: { id: e.w, x: destX, y: destY }
    }
  });
  return { vertexes, edges };
}

export const transferDataToGraphEdgeAndVertex = (chains) => {
  let graph = new dagre.graphlib.Graph({ multigraph: true, directed: true, compound: false });
  graph.setGraph(GRAPH_SETTING);
  graph.setDefaultEdgeLabel(() => { return {}; });
  setEdgeAndNode(graph, chains);
  return transfer(graph);
}


