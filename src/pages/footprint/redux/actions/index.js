import fetch from 'isomorphic-fetch';
import moment from 'moment';

export const FETCH_FOOTPRINTS = 'FETCH_FOOTPRINTS';
export const RECEIVE_FOOTPRINTS_FROM_SERVER = 'RECEIVE_FOOTPRINTS_FROM_SERVER';
export const CHART_VIEW = 'CHART_VIEW';
export const TABLE_VIEW = 'TABLE_VIEW';
export const ACT_TOGGLE_VIEW = 'ACT_TOGGLE_VIEW';
export const SAVE_REMOVE_DATA = 'SAVE_REMOVE_DATA';
/*
 * Asnc actions
 */



export const fetchFootprintsFromServer = (taskId, agentId) => {
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}`;
    fetch(url, { method: 'GET' })
      .then(response => {
        console.log('fetchFootprintsFromServer --> ', response);
        return response.json();
      })
      .then(json => { console.log(json); dispatch(receiveFootprintsFromServer(json.Data, moment().utc().unix())) })
  };
}
export const getMoreFootprint = (taskId, agentId) => {
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}/more`;
    fetch(url, { method: 'GET' })
      .then(response => {
        console.log('getMoreFootprint fetchFootprintsFromServer --> ', response);
        return response.json();
      })
      .then(json => dispatch(receiveFootprintsFromServer(json.Data, moment().utc().unix())))
  };
}

/**
 * Sync actions
 */

export const toggleView = (view) => {
  return {
    type: ACT_TOGGLE_VIEW,
    view
  }
}



const receiveFootprintsFromServer = (payload, receiveTime) => {
  return {
    type: RECEIVE_FOOTPRINTS_FROM_SERVER,
    payload,
    receiveTime
  }
}


