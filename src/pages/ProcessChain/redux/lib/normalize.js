import _ from 'lodash';
import moment from 'moment';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => mapFn(e, fmt))
    .reduce((pre, curr, index, array) => reduceFn(pre, curr, index, array));
}

const mapFn = (chain, fmt) => {
  const {pid: parentId, oid: childId, op, opTime} = chain;
  
  const timeSlot = moment.unix(opTime).format(fmt);
  return {
    vertexes: {
      [parentId]: {
        id: parentId,
        label: parentId,
        src: {},
        dest: { [childId]: { op, opTime } },
        t0: opTime,
        t1: opTime,
        ts0: timeSlot,
        ts1: timeSlot,

      },
      [childId]: {
        id: childId,
        label: childId,
        src: { [parentId]: { op, opTime } },
        dest: {},
        t0: opTime,
        t1: opTime,
        ts0: timeSlot,
        ts1: timeSlot,
      }
    },
    timeSlots: [timeSlot]
  }
}

const formatDate = (unixTime, fmt = 'YYYY-MM-DD') => {
  return moment.unix(unixTime).format(fmt);
}

const reduceFn = (pre, curr, index, array) => {
  let {vertexes, timeSlots} = _.clone(pre);
  const keys = _.keys(curr.vertexes);
  let src = curr.vertexes[keys[0]];
  let dest = curr.vertexes[keys[1]];

  // handel child first
  if (!_.has(vertexes, dest.id)) {
    _.set(vertexes, dest.id, dest);
  } else {
    let origin = _.get(vertexes, dest.id)
    _.set(vertexes, `${dest.id}.src`, _.merge(origin.src, dest.src));
    _.set(vertexes, `${dest.id}.dest`, _.merge(origin.dest, dest.dest));
  }

  // handel parent later
  if (!_.has(vertexes, src.id)) {
    _.set(vertexes, src.id, src);
  } else {
    let origin = _.get(vertexes, src.id);
    _.set(vertexes, `${src.id}.src`, _.merge(origin.src, src.src));
    _.set(vertexes, `${src.id}.dest`, _.merge(origin.dest, src.dest));
  }

// console.log('\tupdate time and timeslot')
  // update time slot
  _.values(vertexes).forEach((v) => {
    let {id, t0, ts0, t1, ts1} = v;
    const srcs = _.keys(v.src);
    const dests = _.keys(v.dest);
    if (_.size(srcs)) {
      t0 = srcs
        .map((x) => pre.vertexes[x].t0)
        .reduce((_pre, _curr) => _pre > _curr ? _pre : _curr);
    }
    if (_.size(dests)) {
      t1 = dests
        .map((x) => _.get(vertexes, `${x}.t1`))
        .reduce((_pre, _curr) => _pre < _curr ? _pre : _curr);
    }
    v.t0 = _.min([t0, t1]);
    v.t1 = _.max([t0, t1]);
    v.ts0 = formatDate(t0);
    v.ts1 = formatDate(t1);
  });

  return { vertexes, timeSlots:_.union(timeSlots, curr.timeSlots) };
}