import _ from 'lodash';
import moment from 'moment';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => mapFn(e, fmt))
    .reduce((pre, curr) => reduceFn(pre, curr));


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
        // latestTimeFromSrc: opTime,
        // latestTimeSlotFromSrc: timeSlot,
        // firstTimeFromDest: opTime,
        // firstTimeSlotFromDest: timeSlot

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
        // latestTimeFromSrc: opTime,
        // latestTimeSlotFromSrc: timeSlot,
        // firstTimeFromDest: opTime,
        // firstTimeSlotFromDest: timeSlot
      }
    },
    timeSlots: [timeSlot]
  }
}

const formatDate = (unixTime, fmt = 'YYYY-MM-DD') => {
  return moment.unix(unixTime).format(fmt);
}

const reduceFn = (pre, curr) => {
  console.log(_.repeat('_', 50))
  let {vertexes, timeSlots} = _.clone(pre);
  timeSlots = _.union(timeSlots, curr.timeSlots)
  console.log('%s -> %s', JSON.stringify(_.keys(curr.vertexes)), JSON.stringify(_.keys(pre.vertexes)));
  // console.log('pre = ',pre)
  const keys = _.keys(curr.vertexes);
  let src = curr.vertexes[keys[0]];
  let dest = curr.vertexes[keys[1]];

  // handel child first
  if (!_.has(vertexes, dest.id)) {
    console.log('add child ', dest.id);
    _.set(vertexes, dest.id, dest);
  } else {
    let origin = _.get(vertexes, dest.id)
    console.log('update child %s', dest.id);
    _.set(vertexes, `${dest.id}.src`, _.merge(origin.src, dest.src));
    _.set(vertexes, `${dest.id}.dest`, _.merge(origin.dest, dest.dest));
  }

  // handel parent later
  if (!_.has(vertexes, src.id)) {
    console.log('add parent ', src.id);
    _.set(vertexes, src.id, src);
  } else {
    console.log('update parent %s', src.id);
    let origin = _.get(vertexes, src.id);
    _.set(vertexes, `${src.id}.src`, _.merge(origin.src, src.src));
    _.set(vertexes, `${src.id}.dest`, _.merge(origin.dest, src.dest));
  }

  // update time slot
  _.values(curr.vertexes).forEach((v) => {
    console.log('update time for ', v.id);
    const srcs = _.keys(v.src);
    const dests = _.keys(v.dest);
    let {t0, t1} = v;
    // console.log('\tori', t1, formatDate(t1), t2, formatDate(t2));
    if (_.size(srcs)) {
      t0 = srcs
        .map((x) => _.get(vertexes, `${x}.t0`))
        .reduce((_pre, _curr) => _pre > _curr ? _pre : _curr);
    }
    if (_.size(dests)) {
      t1 = dests
        .map((x) => _.get(vertexes, `${x}.t1`))
        .reduce((_pre, _curr) => _pre < _curr ? _pre : _curr);
    }
console.log('\t\t\t\t',t0,t1);
    v.t0 = _.min(t0, t1);
    v.t1 = _.max(t0, t1);
    v.ts0 = formatDate(t0);
    v.ts1 = formatDate(t1);


    // let t2 = t1;
    // if (_.size(vertexes[id].dest)) {
    //   t2 = _.keys(vertexes[id].dest)
    //     .map((key) => _.get(vertexes, `${key}.firstTimeFromDest`, 0))
    //     .reduce((pre, curr) => pre > curr ? pre : curr);
    // }
    // let t = t1 > t2 ? t1 : t2;
    // console.log('\tnew', t1, formatDate(t1), t2, formatDate(t2));
    // console.log(`reduce UPDATE new vertex ${id} ------> ${JSON.stringify(vertexes[id])} `);
    // console.log(`update ${id} ->t1:${t} , ${moment.unix(t).format('YYYY-MM-DD')}`);

    // v.latestTimeFromSrc = t1;
    // v.latestTimeSlotFromSrc = formatDate(t1)
    // v.firstTimeFromDest = t2;
    // v.firstTimeSlotFromDest = formatDate(t2)

  });

  return { vertexes, timeSlots };
}