import React, {Component} from 'react';
import dagre from 'dagre';
import ChartView from './ChartView';
import TableView from './TableView';
class SVGGraph extends Component {
  constructor(props) {
    super(props);

  }



  addNodeToGraph(graph, obj, addNeighbors = false) {
    const SIZE = {
      MAX: { width: 100, height: 30 },
      MIN: { width: 40, height: 30 },
    };
    console.log('add node to graph , obj:', obj);
    graph.setNode(obj.id, Object.assign({}, SIZE.MAX, obj));

    if (addNeighbors) {
      _.forEach(obj.from, (name, v) => {
        let value = Object.assign(this.props.processChain[v], SIZE.MAX);
        graph.setNode(v, value);
        graph.setEdge({ v, w: obj.id, name })
      });
      _.forEach(obj.to, (name, w) => {
        let value = Object.assign(this.props.processChain[w], SIZE.MAX);
        graph.setNode(w, value);
        graph.setEdge({ v: obj.id, w, name })
      });
    }
  }
  render() {
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
    graph.setDefaultEdgeLabel(() => {
      return {};
    });
    //   this.addNodeToGraph(graph,this.props.processChain,true);
    _.values(this.props.processChain).forEach(obj => this.addNodeToGraph(graph, obj, true));
    dagre.layout(graph);
    graph.nodes().forEach(n => { console.log('------->', graph.node(n)) });

    return (
      <div>
        <svg>
          <g id="vertexes">
            {

            }
          </g>
        </svg>
        {JSON.stringify(this.props.data) }
      </div>
    );
  }
}

export default SVGGraph;