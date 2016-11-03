
import _ from 'lodash';
import deepMerge from 'deepmerge';
import moment from 'moment';

const compareTime = (obj, defalutValue, compareFn) => {
  if (_.isEmpty(obj)) return defalutValue;
  let arr = [];
  _.forEach(obj, (value, key) => {
    arr = _.union(arr, value.map(act => [act.timestamp]).reduce((p, c) => _.union(p, c)));
  })
  return compareFn(arr);
}

export const normalizeResponse = (apiResponse) => {
  const {footprint, serverMeta, objectDetail} = apiResponse.Data.content[0].content;
  const _serverMeta = serverMeta
    .map(m => Object.assign({}, { [m.metaHashId]: { metaType: m.metaType, metaValue: m.metaValue } }))
    .reduce((pre, curr) => _.merge(pre, curr))

  const aa = objectDetail.map(o => {
    let detail;
    let relatedObjects = [];
    _.forEach(o.event, event => {
      if (event.isMainObject) {
        detail = event;
      } else {
        relatedObjects.push(event)
      }
    })

    return {
      [o.objectId]: { detail, relatedObjects }
    }
  }).reduce((pre, curr) => {
    _.forEach(curr, (o, id) => _.set(pre, id, o));
    return pre;
  });
  const getDetail = (id) => {
    return _.get(aa, `${id}.detail`);
  }

  const getRelatedObjects = (id) => {
    return _.get(aa, `${id}.relatedObjects`);
  }
  const c = footprint.map(f => {
    const {footprintId, parentId: pid, objectId: cid, operation, timestamp} = f;
    let data = {
      maxFootprintId: f.footprintId,
      objects: {
        [cid]: {
          id: cid,
          src: pid === -1 ? {} : {
            [pid]: operation.map(o => { return { oper: o, timestamp } })
          },
          dest: {},
          t0: timestamp,
          t1: timestamp,
          detail: getDetail(cid),
          relatedObjects: getRelatedObjects(cid)
        },
      }
    }
    if (pid !== -1) {
      _.set(data.objects, pid, {
        id: pid,
        src: {},
        dest: {
          [cid]: operation.map(o => { return { oper: o, timestamp } })
        },
        t0: timestamp,
        t1: timestamp,
        detail: getDetail(pid),
        relatedObjects: getRelatedObjects(pid)
      })
    }
    return data;
  }).reduce((pre, curr, index, arr) => {
    let {objects: preVertex} = pre;
    let {objects: currVertex} = curr;
    pre.maxFootprintId = _.max([pre.maxFootprintId, curr.maxFootprintId]);

    _.forEach(currVertex, (v, id) => {
      if (!_.has(preVertex, id)) {
        _.set(preVertex, id, v);
      } else {
        _.set(preVertex, id, deepMerge(_.get(preVertex, id), v));
      }
    });
    _.values(preVertex).forEach((v) => {
      let {id, t0, t1, src, dest} = v;
      let _t0 = compareTime(src, t0, _.max);
      let _t1 = compareTime(dest, t1, _.min);
      v.t0 = _.min([_t0, _t1]);
      v.t1 = _.max([_t0, _t1]);
    });
    return pre;
  })

  _.set(c, 'metaData', _serverMeta);

  return c;
}
// console.log(JSON.stringify(c, '', 2));