import { ACT_TOGGLE_VIEW, CHART_VIEW} from '../actions';

const dispalyView = (state = CHART_VIEW, action) => {
  switch (action.type) {
    case ACT_TOGGLE_VIEW:
      return action.view;
    default:
      return state;
  }
}

export default dispalyView;