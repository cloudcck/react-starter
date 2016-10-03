import fetch from 'isomorphic-fetch';
import moment from 'moment';

export const FETCH_FOOTPRINTS = 'FETCH_FOOTPRINTS';
export const RECEIVE_FOOTPRINTS_FROM_SERVER = 'RECEIVE_FOOTPRINTS_FROM_SERVER';

/*
 * Asnc actions
 */
export function fetchFootprintsFromServer(taskId,agentId) {
  return (dispatch, getState) => {
    let url = `/api/footprint/${taskId}/${agentId}`;
    fetch(url, { method: 'GET' })
      .then(response => {
        console.log('fetchFootprintsFromServer --> ',response);
        return response.json();
      })
      .then(json => dispatch(receiveFootprintsFromServer(json.Data, moment().utc().unix())))
  };
}


export function receiveFootprintsFromServer(payload, receiveTime) {
  return {
    type: RECEIVE_FOOTPRINTS_FROM_SERVER,
    payload,
    receiveTime
  }
}
