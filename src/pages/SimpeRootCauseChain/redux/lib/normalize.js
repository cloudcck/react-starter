import _ from 'lodash';
import moment from 'moment';

export const normailze = (processes, fmt = 'YYYY-MM-DD') => {
  return _.sortByAll(processes, ['opTime'], ['asc'])
    .map(e => xxxMap(e, fmt))
    .reduce((preveriousValue, currentValue) => xxxReduce(preveriousValue, currentValue));


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
        latestTimeFromSrc: opTime,
        latestTimeSlotFromSrc: timeSlot,
        firstTimeFromDest: opTime,
        firstTimeSlotFromDest: timeSlot
      }
    },
    timeSlots: [timeSlot]
  }
}

const xxxReduce = (preveriousValue, currentValue) => {
  let {vertexes} = preveriousValue;
  // console.log(_.repeat('-', 100));
  // console.log(JSON.stringify(vertexes, '', 2));
  _.forEach(currentValue.vertexes, (value, id) => {

    if (_.has(vertexes, id)) {
      let origin = vertexes[id];
      origin.src = _.merge(origin.src, value.src);
      origin.dest = _.merge(origin.dest, value.dest);

      let t1 =
        _.keys(origin.src)
          .map((key) => _.get(vertexes, `${key}.latestTimeFromSrc`))
          .reduce((pre, curr) => pre > curr ? pre : curr);

      let t2 = t1;
      if (_.size(origin.dest)) {
        t2 =
          _.keys(origin.dest)
            .map((key) => _.get(vertexes, `${key}.firstTimeFromDest`, 0))
            .reduce((pre, curr) => pre > curr ? pre : curr);
      }
      origin.latestTimeFromSrc = t1;
      origin.latestTimeSlotFromSrc = moment.unix(t1).format('YYYY-MM-DD');
      origin.firstTimeFromDest = t2;
      origin.firstTimeSlotFromDest = moment.unix(t2).format('YYYY-MM-DD');
      console.log(`UPDATE ${id} to ${JSON.stringify(origin)} `);
    } else {
      console.log(`ADD ${id}\t${JSON.stringify(value)} `);
      vertexes[id] = value;
    }
  })
  preveriousValue.timeSlots = _.union(preveriousValue.timeSlots, currentValue.timeSlots);
  return preveriousValue;
}