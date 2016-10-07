import fetch from 'isomorphic-fetch';
import moment from 'moment';

export const FETCH_FOOTPRINTS = 'FETCH_FOOTPRINTS';
export const RECEIVE_FOOTPRINTS_FROM_SERVER = 'RECEIVE_FOOTPRINTS_FROM_SERVER';
export const CHART_VIEW = 'CHART_VIEW';
export const TABLE_VIEW = 'TABLE_VIEW';
export const ACT_TOGGLE_VIEW = 'ACT_TOGGLE_VIEW';
/*
 * Asnc actions
 */
export function fetchFootprintsFromServer(taskId, agentId) {
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}`;
    fetch(url, { method: 'GET' })
      .then(response => {
        console.log('fetchFootprintsFromServer --> ', response);
        return response.json();
      })
      .then(json => dispatch(receiveFootprintsFromServer(json.Data, moment().utc().unix())))
  };
}

/**
 * Sync actions
 */

export function toggleView(view) {
  return {
    type: ACT_TOGGLE_VIEW,
    view
  }
}
export function receiveFootprintsFromServer(payload, receiveTime) {
  return {
    type: RECEIVE_FOOTPRINTS_FROM_SERVER,
    payload,
    receiveTime
  }
}
