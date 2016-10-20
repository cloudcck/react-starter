import _ from 'lodash';
import moment from 'moment';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => xxxMap(e, fmt))
    .reduce((pre, curr) => xxxReduce(pre, curr));
}

const xxxMap = (chain, fmt) => {
  const {pid: parentId, oid: childId, op, opTime} = chain;
  const timeSlot = moment.unix(opTime).format(fmt);
  return {
    vertexes: {
      [parentId]: {
        id: parentId,
        label: parentId,
        src: {},
        dest: { [childId]: { op, opTime } },
        latestOperTime: opTime,
        timeSlot
      },
      [childId]: {
        id: childId,
        label: childId,
        src: { [parentId]: { op, opTime } },
        dest: {},
        latestOperTime: opTime,
        timeSlot
      }
    },
    timeSlots: [timeSlot]
  }
}

const xxxReduce = (pre, curr) => {
  let {vertexes} = pre;
  _.forEach(curr.vertexes, (value, key) => {
    if (_.has(vertexes, key)) {
      vertexes[key].src = _.merge(vertexes[key].src, value.src);
      vertexes[key].dest = _.merge(vertexes[key].dest, value.dest);
      vertexes[key].latestOperTime = vertexes[key].latestOperTime < value.latestOperTime ? vertexes[key].latestOperTime : value.latestOperTime;
      vertexes[key].timeSlot = value.timeSlot;
    } else {
      vertexes[key] = value;
    }
  })
  pre.timeSlots = _.union(pre.timeSlots, curr.timeSlots);
  return pre;
}