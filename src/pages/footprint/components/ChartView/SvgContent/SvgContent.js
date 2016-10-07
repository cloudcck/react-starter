import React, {Component} from 'react';
import dagre from 'dagre';
import _ from 'lodash';
import Vertex from './Vertex';
import Edge from './Edge';
class SvgContent extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    let graph = this.createGraph();
    this.setState({ graph })
  }

  createGraph() {
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
  addNodeToGraph(graph, obj, addNeighbors = false) {
    const SIZE = {
      MAX: { width: 100, height: 30 },
      MIN: { width: 40, height: 30 },
    };

    const COLOR = {
      DANGER: 'red',
      NORMAL: 'gray',
      NONE: 'white',
      HIGHTLIGHT: 'yellow',
    };
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
    _.values(this.props.processChain).forEach(obj => this.addNodeToGraph(this.state.graph, obj, true));
    dagre.layout(this.state.graph);
    const svgWidth = `${window.innerWidth}px`;
    const svgHeight = `${window.innerHeight > 600 ? 600 : window.innerHeight}px`;
    const svgStyle = { width: svgWidth, height: svgHeight };
    let edgeId = 1;
    return (
      <div id="svg-content" style={svgStyle}>
        <svg width="100%" height="100%">
          <defs>
            <marker id="path_start" markerWidth="4" markerHeight="4" refX="2" refY="2" viewBox="0 0 4 4" orient="auto">
              <circle id="SvgjsCircle1960" r="1" cx="2" cy="2" fill="gray"></circle>
            </marker>
            <marker id="path_end" markerWidth="12" markerHeight="12" refX="6" refY="6" viewBox="0 0 12 12" orient="auto">
              <path id="SvgjsPath1962" d="M-6 0L6 6L-6 12 " fill="gray"></path>
            </marker>
          </defs>
          <g id="vertexes">
            {
              this.state.graph.edges().map(e => <Edge key={edgeId++} data={e} points={this.state.graph.edge(e).points} />)
            }
            {
              this.state.graph.nodes().map(n => <Vertex key={n} data={this.state.graph.node(n) } />)
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default SvgContent;