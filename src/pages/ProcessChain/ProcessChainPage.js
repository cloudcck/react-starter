import React, { PureComponent, Component } from 'react';
import { connect } from 'react-redux';
import dagre from 'dagre';
import _ from 'lodash'
import JSONTree from 'react-json-tree';
import { Map, List, fromJS } from 'immutable';
import { fetchRemoteData, getMore, getParent, getChild } from './redux/action';
import moment from 'moment';
import Edge from './components/Edge';
import Vertex from './components/Vertex';
import VertexDetail from './components/VertexDetail';
import { transferDataToGraphEdgeAndVertex } from './ProcessChainLib';
import './ProcessChainPage.css'

class ProcessChain extends PureComponent {
    constructor(props) {
        super(props);
        this.toggleHidden = this.toggleHidden.bind(this);
        this.toggleSize = this.toggleSize.bind(this);
        this.reAddVertex = this.reAddVertex.bind(this);
        this.showNodeDetail = this.showNodeDetail.bind(this);
    }
    componentWillMount() {
        let {taskId, agentId} = this.props.routeParams;
        this.props.fetchRemoteData(taskId, agentId);
        this.state = { hiddenNodes: [], smallNodes: [] };
        console.log('componentWillMount  ', JSON.stringify(this.state))
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //   return !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
    // }

    toggleHidden(id) {
        const newState = Object.assign({}, this.state, { hiddenNodes: _.uniq([...this.state.hiddenNodes, '' + id]) });
        this.setState(newState, () => { console.log('after toggle Hidden ,', JSON.stringify(this.state)) });
    }
    reAddVertex(id) {
        const newState = Object.assign({}, this.state, { hiddenNodes: this.state.hiddenNodes.filter(n => n !== id) });
        this.setState(newState);
    }
    toggleSize(id) {
        console.log('toggle size node ', id);
    }
    showNodeDetail(id) {
        console.log(`show node detail of ${id}`);
        console.log('this.props', this.props);
        const detailObject = _.get(this.props.chains, `objects.${id}`);
        console.log('detailObject:', detailObject);
        this.setState(Object.assign({}, this.state, { detailObject: detailObject }));
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('shouldComponentUpdate nextState:', nextState);
        return true;
    }

    render() {
        const {hiddenNodes} = this.state;
        const {edges, vertexes} = transferDataToGraphEdgeAndVertex(this.props.chains, hiddenNodes);
        const getParentFn = this.props.getParent;
        const getChildFn = this.props.getChild;
        return (
            <div>

                <button onClick={() => { this.props.getMore() } }>Get More</button>
                <div className="hidden-nodes">
                    {hiddenNodes.map(n => <span className="label label-success" key={n} onClick={() => { this.reAddVertex(n) } }>{this.props.chains.objects[n].label}</span>)}
                </div>
                {
                    <svg width="100%" height="600px">
                        <defs>
                            <marker id="path_start" markerWidth="4" markerHeight="4" refX="2" refY="2" viewBox="0 0 4 4" orient="auto"><circle r="1" cx="2" cy="2" fill="gray"></circle></marker>
                            <marker id="path_end" markerWidth="12" markerHeight="12" refX="6" refY="6" viewBox="0 0 12 12" orient="auto"><path d="M-6 0L6 6L-6 12 " fill="gray"></path></marker>
                        </defs>
                        <g>
                            {edges.map(e => <Edge key={e.id} data={e} />)}
                            {vertexes.map(n => <Vertex key={n.id} data={n}
                                getParent={getParentFn}
                                getChild={getChildFn}
                                toggleHidden={this.toggleHidden}
                                toggleSize={this.toggleSize}
                                showNodeDetail={this.showNodeDetail}
                                metaData={this.props.chains.metaData}
                                />)}
                        </g>
                    </svg>
                }
                <aside>
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