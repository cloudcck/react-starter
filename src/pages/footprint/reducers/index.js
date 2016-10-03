import { List, fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import _ from 'lodash';
import { FETCH_FOOTPRINTS, RECEIVE_FOOTPRINTS_FROM_SERVER } from '../actions';

const footprints = (state = List(), action) => {
  switch (action.type) {
    case RECEIVE_FOOTPRINTS_FROM_SERVER:
      let serverMeta = extractServerMeta(_.get(action.payload, 'serverMeta'));
      let processChain = extractProcessChain(_.get(action.payload, 'processChain'));
      return fromJS({ serverMeta, processChain });
    default:
      return state;
  }
}

const footprintState = combineReducers({
  footprints
})

export default footprintState;

/////////////////////////////
const extractServerMeta = (serverMeta) => {
  let meta = new Map();
  serverMeta.forEach(m => {
    meta.set(m.metaHashId, { type: m.metaType, value: m.metaValue });
  });
  return meta;
}

const extractProcessChain = (processChain) => {
  const SIZE = {
    MAX: { width: 100, height: 30 },
    MIN: { width: 40, height: 30 },
  };
  let processObject = {};
  processChain.forEach(chain => {
    console.log('chain:', chain);
    let fromId = -1;

    fromId = chain.processId > fromId ? chain.processId : fromId;
    let from = {};
    let id = `${chain.objectId}`;
    if (processObject[id]) {
      console.log(`processObjectectId : ${id} already exists, will update it `)
    }
    
    let title = id;
    let parentId = `${chain.parentId}`;
    let metas = [];
    let type = chain.isProcess ? 0 : 1;
    if (parentId > -1 && chain.operation.length) {
      chain.operation.forEach(n => {
        let name = `${n}`;
        let parentprocessObject = processObject[parentId] || createParentprocessObject(processObject, parentId);
        from[parentId] = name;
        parentprocessObject.to[id] = name;
      });
    }
    chain.objectDetail.forEach(detail => {
      detail.metaHashId.forEach(meta => metas.push(meta))
    });
    processObject[id] = Object.assign({}, { id, title, metas, from, to: {}, show: true, type }, SIZE.MAX);;
  });

  return processObject;
}
const createParentprocessObject = (processObject, id) => {
  processObject[id] = Object.assign({}, { id: id, title: `${id}`, from: {}, to: {}, type: 0, show: true, metas: [] });
  return processObject[id];
}



