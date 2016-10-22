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
        t0:opTime,
        t1:opTime,
        latestTimeFromSrc: opTime,
        latestTimeSlotFromSrc: timeSlot,
        firstTimeFromDest: opTime,
        firstTimeSlotFromDest: timeSlot

      },
      [childId]: {
        id: childId,
        label: childId,
        src: { [parentId]: { op, opTime } },
        dest: {},
        t0:opTime,
        t1:opTime,
        latestTimeFromSrc: opTime,
        latestTimeSlotFromSrc: timeSlot,
        firstTimeFromDest: opTime,
        firstTimeSlotFromDest: timeSlot
      }
    },
    timeSlots: [timeSlot]
  }
}

const reduceFn = (pre, curr) => {
  let {vertexes} = pre;
  // console.log(_.repeat('-', 100));
  // console.log(JSON.stringify(vertexes, '', 2));
  _.forEach(curr.vertexes, (value, id) => {

    if (_.has(vertexes, id)) {

      vertexes[id].src = _.merge(vertexes[id].src, value.src);
      vertexes[id].dest = _.merge(vertexes[id].dest, value.dest);


      let t1 = _.keys(vertexes[id].src)
        .map((key) => [_.get(vertexes, `${key}.latestTimeFromSrc`)])
        .reduce((pre, curr) => pre > curr ? pre : curr);

      let t2 = t1;
      if (_.size(vertexes[id].dest)) {
        t2 = _.keys(vertexes[id].dest)
          .map((key) => _.get(vertexes, `${key}.firstTimeFromDest`, 0))
          .reduce((pre, curr) => pre > curr ? pre : curr);
      }

      let t = t1 > t2 ? t1 : t2;
      console.log(`${t1}\n${t2}\->${t}`)
      console.log(`reduce UPDATE new vertex ${id} ------> ${JSON.stringify(vertexes[id])} `);
      console.log(`update ${id} ->t1:${t} , ${moment.unix(t).format('YYYY-MM-DD')}`);

      vertexes[id].latestTimeFromSrc = t1;
      vertexes[id].latestTimeSlotFromSrc = moment.unix(t1).format('YYYY-MM-DD');

      vertexes[id].firstTimeFromDest = t2;
      vertexes[id].firstTimeSlotFromDest = moment.unix(t2).format('YYYY-MM-DD');

      // vertexes[id].latestOperTime = vertexes[id].latestOperTime > value.latestOperTime ? vertexes[id].latestOperTime : value.latestOperTime;
      // vertexes[id].timeSlot = value.timeSlot;
    } else {
      console.log(`reduce ADD new vertex ${id}, ${JSON.stringify(value)} `);
      vertexes[id] = value;
    }
  })
  pre.timeSlots = _.union(pre.timeSlots, curr.timeSlots);
  return pre;
}

const _reduceFn = (pre, curr) => {
  let {vertexes, timeSlots} = _.clone(pre);
  timeSlots = _.union(timeSlots, curr.timeSlots)

  console.log('%s -> %s', JSON.stringify(_.keys(curr.vertexes)), JSON.stringify(_.keys(pre.vertexes)));
  // console.log('pre = ',pre)
  const keys = _.keys(curr.vertexes);
  let src = curr.vertexes[keys[0]];
  let dest = curr.vertexes[keys[1]];

  // handel child first
  if (!_.has(vertexes, dest.id)) {
    _.set(vertexes, dest.id, dest);
  } else {
    let origin = _.get(vertexes, dest.id)
    console.warn('update %s', dest.id);
    _.set(vertexes, `${dest.id}.src`, _.merge(origin.src, dest.src));
    _.set(vertexes, `${dest.id}.dest`, _.merge(origin.dest, dest.dest));

    let _t0, _t1;    

  }

  // handel parent later
  if (!_.has(vertexes, src.id)) {
    _.set(vertexes, src.id, src);
  } else {
    console.warn('update %s', src.id);
    let origin = _.get(vertexes, src.id);
    _.set(vertexes, `${src.id}.src`, _.merge(origin.src, src.src));
    _.set(vertexes, `${src.id}.dest`, _.merge(origin.dest, src.dest));
  }

  _.values(curr.vertexes,(v)=>{
    console.log('v ----->',v.id);
  });


  return { vertexes, timeSlots };
}