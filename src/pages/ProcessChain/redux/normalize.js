import _ from 'lodash';
import moment from 'moment';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => mapFn(e, fmt))
    .reduce((pre, curr, index, array) => reduceFn(pre, curr, index, array));
}
const formatDate = (unixTime, fmt = 'YYYY-MM-DD') => {
  return moment.unix(unixTime).format(fmt);
}

const mapFn = (chain, fmt) => {
  const {pid, oid, op, opTime: t} = chain;
  const ts = formatDate(t, fmt);
  const x = (id, label, src, dest, t, ts) => {
    return { id, label, src, dest, t0: t, t1: t, ts0: ts, ts1: ts }
  };
  const src = { [pid]: [{ op, t }] };
  const dest = { [oid]: [{ op, t }] };
  return {
    vertexes: {
      [pid]: x(pid, pid, {}, dest, t, ts),
      [oid]: x(oid, oid, src, {}, t, ts)
    },
    timeSlots: [ts]
  }
}

const mergeObj = (ori, obj) => {
  _.forEach(obj, (arr, key) => {
    if (_.has(obj, key)) {
      _.set(ori, key, arrayUnion(_.get(ori, key, []), arr));
    } else {
      _.set(ori, key, arr);
    }
  });

  return ori;
}
const arrayUnion = (arr1, arr2) => {
  let union = _.union(arr1, arr2);
  for (let i = 0; i < union.length; i++) {
    for (let j = i + 1; j < union.length; j++) {
      if (_.isEqual((union[i], union[j]))) {
        union.splice(j, 1);
        j--;
      }
    }
  }
  return union;
}


const reduceFn = (pre, curr, index, array) => {
  let {vertexes, timeSlots} = _.clone(pre);
  const keys = _.keys(curr.vertexes);
  let src = curr.vertexes[keys[0]];
  let dest = curr.vertexes[keys[1]];

  _.forEach(curr.vertexes, (v, id) => {
    if (!_.has(vertexes, id)) {
      _.set(vertexes, id, v);
    } else {
      let origin = _.get(vertexes, id)
      _.set(vertexes[id], 'src', mergeObj(origin.src, v.src));
      _.set(vertexes[id], 'dest', mergeObj(origin.dest, v.dest));
    }
  });

  // console.log('\tupdate time and timeslot')
  // update time slot
  _.values(vertexes).forEach((v) => {
    let {id, t0, ts0, t1, ts1} = v;
    const srcs = _.keys(v.src);
    const dests = _.keys(v.dest);
    if (_.size(srcs)) {
      t0 = srcs
        .map((x) => vertexes[x].t0)
        .reduce((_pre, _curr) => _pre > _curr ? _pre : _curr);
    }
    if (_.size(dests)) {
      t1 = dests
        .map((x) => vertexes[x].t1)
        .reduce((_pre, _curr) => _pre < _curr ? _pre : _curr);
    }
    v.t0 = _.min([t0, t1]);
    v.t1 = _.max([t0, t1]);
    v.ts0 = formatDate(t0);
    v.ts1 = formatDate(t1);
  });

  return { vertexes, timeSlots: _.union(timeSlots, curr.timeSlots) };
}