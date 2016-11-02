import _ from 'lodash';
import moment from 'moment';
import deepMerge from 'deepmerge';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => mapFn(e, fmt))
    .reduce((pre, curr, index, array) => reduceFn(pre, curr, index, array));
}


const mapFn = (chain, fmt) => {
  const {pid, oid, op, opTime: t} = chain;
  const ts = formatDate(t, fmt);
  const x = (id, label, src, dest, t) => {
    return { id, label, src, dest, t0: t, t1: t }
  };
  const src = { [pid]: [{ op, t }] };
  const dest = { [oid]: [{ op, t }] };
  return {
    [pid]: x(pid, pid, {}, dest, t),
    [oid]: x(oid, oid, src, {}, t)
  }
}

const reduceFn = (pre, curr, index, array) => {

  _.forEach(curr, (v, id) => {
    if (!_.has(pre, id)) {
      _.set(pre, id, v);
    } else {
      _.set(pre, id, deepMerge(_.get(pre, id), v));
    }
  });

  // update time slot
  _.values(pre).forEach((v) => {
    let {id, t0, ts0, t1, ts1, src, dest} = v;
    let _t0 = compareTime(src, t0, _.max);
    let _t1 = compareTime(dest, t1, _.min);
    v.t0 = _.min([_t0, _t1]);
    v.t1 = _.max([_t0, _t1]);
    v.ts0 = formatDate(v.t0);
    v.ts1 = formatDate(v.t1);
  });
  return pre;
}

const formatDate = (unixTime, fmt = 'YYYY-MM-DD') => {
  return moment.unix(unixTime).format(fmt);
}

const compareTime = (obj, defalutValue, compareFn) => {
  if (_.isEmpty(obj)) return defalutValue;
  let arr = [];
  _.forEach(obj, (value, key) => {
    arr = _.union(arr, value.map(act => [act.t]).reduce((p, c) => _.union(p, c)));
  })
  return compareFn(arr);
}
