import fetch from 'isomorphic-fetch';
import moment from 'moment';
export const SAVE_REMOVE_DATA = 'SAVE_REMOVE_DATA';

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
      .then((json) =>
        dispatch(saveRemoteData(json.Data)
        )
      )
  }
}
const saveRemoteData = (processes) => {
  console.log('saveRemoteData', processes);
  return {
    type: SAVE_REMOVE_DATA,
    processes
  }
}