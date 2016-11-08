import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import SVG from 'svg.js';
import 'svg.draggable.js';
import _ from 'lodash'
import JSONTree from 'react-json-tree';
import { Map, List, fromJS } from 'immutable';
import saveSvgAsPng from 'save-svg-as-png'
import { fetchRemoteData, getMore, getParent, getChild } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
import VertexDetail from './components/VertexDetail';
import HiddenVertexes from './components/HiddenVertexes';
import { transferDataToGraphEdgeAndVertex } from './ProcessChainLib';

import './ProcessChainPage.css'
const MAX_SCALE = 0.2, MIN_SCALE = 2.0;

class ProcessChain extends PureComponent {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
        this.toggleSize = this.toggleSize.bind(this);
        this.reAddVertex = this.reAddVertex.bind(this);
        this.showNodeDetail = this.showNodeDetail.bind(this);
        this.hideNoneSuspiciousNodes = this.hideNoneSuspiciousNodes.bind(this);
        this.showAllNodes = this.showAllNodes.bind(this);
        this.showParent = this.showParent.bind(this);
        this.showChildren = this.showChildren.bind(this);
        this.exportSvg = this.exportSvg.bind(this);
        this.scaleRatio = 1.0;
        this.scaleIn = this.scaleIn.bind(this);
        this.scaleOut = this.scaleOut.bind(this);
        this.resetScale = this.resetScale.bind(this);
        this.addHighlight = this.addHighlight.bind(this);
        this.removeHighlight = this.removeHighlight.bind(this);
    }
    componentWillMount() {
        let {taskId, agentId} = this.props.routeParams;
        this.props.fetchRemoteData(taskId, agentId);
        this.state = { hiddenNodes: [], smallNodes: [] };
    }
    exportSvg() {
        // const {x, y, height, width} = svg.bbox();
        let svgGraph = document.getElementById('svg-graph');
        // console.log('svg-graph,', svgGraph);
        const {x, y, height, width} = svgGraph.getBBox();
        console.log('saveSvgAsPng:', saveSvgAsPng);
        saveSvgAsPng.saveSvgAsPng(svgGraph, 'test.png', {
            backgroundColor: '#fff',
            top: y - 50, left: x - 50, height: height + 100, width: width + 100,
        });

    }

    toggleHidden(id) {
        const newState = Object.assign({}, this.state, { hiddenNodes: _.uniq([...this.state.hiddenNodes, '' + id]) });
        this.setState(newState);
    }
    reAddVertex(id) {
        const newState = Object.assign({}, this.state, { hiddenNodes: this.state.hiddenNodes.filter(n => n !== id) });
        this.setState(newState);
    }
    toggleSize(id) {
        // console.log('toggle size node ', id);
    }
    showNodeDetail(id) {
        // console.log(`show node detail of ${id}`);
        // console.log('this.props', this.props);
        const detailObject = _.get(this.props.chains, `objects.${id}`);
        // console.log('detailObject:', detailObject);
        this.setState(Object.assign({}, this.state, { detailObject: detailObject }));
    }
    hideNoneSuspiciousNodes() {
        const hiddenNodes = _.values(this.props.chains.objects).filter(o => !o.isSuspicious && !o.isMatched).map(o => o.id);
        // console.log('hiddenNodes :', JSON.stringify(hiddenNodes));
        const newState = Object.assign({}, this.state, { hiddenNodes: hiddenNodes });
        this.setState(newState);
    }
    showAllNodes() {
        const newState = Object.assign({}, this.state, { hiddenNodes: [] });
        this.setState(newState);
    }
    showParent(id) {
        const ids = _.keys(this.props.chains.objects[id].src);
        const hiddenNodes = this.state.hiddenNodes.filter(n => !_.includes(ids, n))
        const newState = Object.assign({}, this.state, { hiddenNodes: hiddenNodes });
        this.setState(newState);
    }
    showChildren(id) {
        const ids = _.keys(this.props.chains.objects[id].dest);
        const hiddenNodes = this.state.hiddenNodes.filter(n => !_.includes(ids, n))
        const newState = Object.assign({}, this.state, { hiddenNodes: hiddenNodes });
        this.setState(newState);
    }
    componentDidUpdate() {
        SVG.get('diagram').style('cursor', 'move').draggable();
    }

    addHighlight(id) {
        ['diagram', id, ...this.graph.neighbors(id), ...this.graph.nodeEdges(id).map(e => e.name)]
            .forEach(v => { SVG.get(v).addClass('highlight'); })

    }

    removeHighlight(id) {
        ['diagram', id, ...this.graph.neighbors(id), ...this.graph.nodeEdges(id).map(e => e.name)]
            .forEach(v => { SVG.get(v).removeClass('highlight'); })
    }


    scaleIn() {
        if (this.scaleRatio < MAX_SCALE) return;
        this.scaleRatio -= 0.1;
        SVG.get('#diagram').scale(this.scaleRatio);
    }
    resetScale() {
        this.scaleRatio = 1.0;
        SVG.get('#diagram').scale(this.scaleRatio);
    }
    scaleOut() {
        if (this.scaleRatio > MIN_SCALE) return;
        this.scaleRatio += 0.1;
        SVG.get('#diagram').scale(this.scaleRatio);
    }

    render() {
        const {hiddenNodes} = this.state;
        const {graph, edges, vertexes} = transferDataToGraphEdgeAndVertex(this.props.chains, hiddenNodes);
        this.graph = graph;
        this.edges = edges;
        this.vertexes = vertexes;
        const getParentFn = this.props.getParent;
        const getChildFn = this.props.getChild;
        return (
            <div>
                <button onClick={() => { this.props.getMore() } }>Get More</button>
                <button onClick={() => { this.hideNoneSuspiciousNodes() } }>hideNoneSuspiciousNodes</button>
                <button onClick={() => { this.showAllNodes() } }>showAllNodes</button>
                <button onClick={() => { this.exportSvg() } }>export</button>
                <HiddenVertexes hiddenNodes={hiddenNodes} referenceObject={this.props.chains.objects} reAddVertex={this.reAddVertex} />
                <div className="graph-content">
                    {
                        <svg id="svg-graph" width="100%" height="600px">
                            <defs>
                                <marker id="path_start" markerWidth="4" markerHeight="4" refX="2" refY="2" viewBox="0 0 4 4" orient="auto"><circle r="1" cx="2" cy="2" fill="gray"></circle></marker>
                                <marker id="path_end" markerWidth="12" markerHeight="12" refX="6" refY="6" viewBox="0 0 12 12" orient="auto"><path d="M-6 0L6 6L-6 12 " fill="gray"></path></marker>
                            </defs>
                            <g id="diagram">
                                {this.edges.map(e => <Edge key={e.id} data={e} />)}
                                {this.vertexes.map(n => <Vertex key={n.id}
                                    data={n}
                                    showParent={this.showParent}
                                    showChildren={this.showChildren}
                                    toggleHidden={this.toggleHidden}
                                    toggleSize={this.toggleSize}
                                    showNodeDetail={this.showNodeDetail}
                                    metaData={this.props.chains.metaData}
                                    hiddenNodes={hiddenNodes}
                                    addHighlight={this.addHighlight}
                                    removeHighlight={this.removeHighlight}
                                    />)}
                            </g>
                        </svg>
                    }
                </div>
                <div>
                    <button onClick={this.scaleOut}><i className="fa fa-plus"></i></button>
                    <button onClick={this.resetScale}><i className="fa fa-refresh"></i></button>
                    <button onClick={this.scaleIn}><i className="fa fa-minus"></i></button>
                </div>
                <aside className="vertex-detail-aside">
                    <VertexDetail data={this.state.detailObject} metaData={this.props.chains.metaData} />
                </aside>
            </div >
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
        fetchRemoteData: (taskId, agentId) => {
            dispatch(fetchRemoteData(taskId, agentId));
        },
        getParent: (taskId, agentId, objectId) => {
            dispatch(getParent(taskId, agentId, objectId));
        },
        getChild: (taskId, agentId, objectId) => {
            dispatch(getChild(taskId, agentId, objectId));
        },
        getMore: (taskId, agentId) => {
            dispatch(getMore(taskId, agentId));
        }
    };
}


const ProcessChainPage = connect(mapStateToProps, mapDispatchToProps)(ProcessChain);
export default ProcessChainPage;