import fetch from 'isomorphic-fetch';
import moment from 'moment';
export const INIT_PROCESS_CHAIN_DATA = 'INIT_PROCESS_CHAIN_DATA';
export const APPEND_PROCESS_CHAIN_DATA = 'APPEND_PROCESS_CHAIN_DATA';

export const fetchRemoteData = (taskId, agentId) => {
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}`;
    fetch(url, { method: 'GET' })
      .then(res => {
        if (res.status > 400) {
          throw new Error("Bad response from server");
        };
        return res.json();
      })
      .then((json) => dispatch(initProcessChainData(json.Data))
      )
  }
}

export const getMore = (taskId, agentId) => {
  console.log('------> get more ');
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}`;
    fetch(url, { method: 'GET' })
      .then(res => {
        if (res.status > 400) {
          throw new Error("Bad response from server");
        };
        return res.json();
      })
      .then((json) => dispatch(appendProcessChainData(json.Data))
      )
  }
}
export const getParent = (taskId, agentId, objectId) => {
  console.log('------> get parent ');
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}/${objectId}/parent`;
    fetch(url, { method: 'GET' })
      .then(res => {
        if (res.status > 400) {
          throw new Error("Bad response from server");
        };
        return res.json();
      })
      .then((json) => dispatch(appendProcessChainData(json.Data))
      )
  }
}
export const getChild = (taskId, agentId, objectId) => {
  console.log('------> get child ');
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}/${objectId}/child`;
    fetch(url, { method: 'GET' })
      .then(res => {
        if (res.status > 400) {
          throw new Error("Bad response from server");
        };
        return res.json();
      })
      .then((json) => dispatch(appendProcessChainData(json.Data))
      )
  }
}

const initProcessChainData = (processes) => {
  return {
    type: INIT_PROCESS_CHAIN_DATA,
    processes
  }
}

const appendProcessChainData = (processes) => {
  return {
    type: APPEND_PROCESS_CHAIN_DATA,
    processes
  }
}