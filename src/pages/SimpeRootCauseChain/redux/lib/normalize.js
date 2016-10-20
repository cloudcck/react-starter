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
  preveriousValue.timeSlots = _.union(preveriousValue.timeSlots, currentValue.timeSlots);
  return preveriousValue;
}