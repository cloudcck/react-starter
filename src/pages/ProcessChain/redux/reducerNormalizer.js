
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

const normalizeServerMeta = (serverMetaArray) => {
  return serverMetaArray
    .map(m => Object.assign({}, { [m.metaHashId]: { metaType: m.metaType, metaValue: m.metaValue } }))
    .reduce((pre, curr) => _.merge(pre, curr))
}

const normalizeObjectDetail = (objectDetailArray) => {
  return objectDetailArray
    .map(o => {
      let detail = {}, relatedObjects = [];
      _.forEach(o.event, event => event.isMainObject ? detail = event : relatedObjects.push(event))
      return { [o.objectId]: { detail, relatedObjects } }
    })
    .reduce((pre, curr) => {
      _.forEach(curr, (o, id) => _.set(pre, id, o));
      return pre;
    });
}

export const normalizeResponse = (apiResponse) => {
  const {footprint, serverMeta: serverMetaArray, objectDetail: objectDetailArray} = apiResponse.Data.content[0].content;
  const _serverMeta = normalizeServerMeta(serverMetaArray);
  const _objectDetail = normalizeObjectDetail(objectDetailArray)

  const getObjectLabel = (id) => {
    const metaHashId = _.get(_objectDetail, `${id}.detail.objectName`);
    const meta = _.get(_serverMeta, metaHashId);
    return _.get(meta, 'metaValue', '');
  }

  const createObject = (id, src, dest, timestamp) => {
    let obj = {
      id: `${id}`,
      label: getObjectLabel(id),
      src, dest,
      t0: timestamp,
      t1: timestamp,
      detail: _.get(_objectDetail, `${id}.detail`),
      relatedObjects: _.get(_objectDetail, `${id}.relatedObjects`)
    }
    return obj;
  }

  const isValidObject = (id) => { return _.has(_objectDetail, id); }


  const c = footprint
    .map(f => {
      const {footprintId, parentId: pid, objectId: cid, operation, timestamp} = f;
      const isRoot = pid === -1;
      const src = isRoot ? {} : { [pid]: operation.map(o => { return { oper: o, timestamp } }) };
      const dest = { [cid]: operation.map(o => { return { oper: o, timestamp } }) };

      let data = { maxFootprintId: f.footprintId, objects: {} }

      // save parent vertex
      if (!isRoot && isValidObject(pid)) {
        _.set(data.objects, pid, createObject(pid, {}, dest, timestamp))
      }

      // save child vertex
      if (isValidObject(cid)) {
        _.set(data.objects, cid, createObject(cid, src, {}, timestamp))
      }

      return data;
    })
    .reduce((pre, curr, index, arr) => {
      pre.maxFootprintId = _.max([pre.maxFootprintId, curr.maxFootprintId]);
      let {objects: preVertex} = pre;
      let {objects: currVertex} = curr;

      // Add or update exists vertex
      _.forEach(currVertex, (v, id) => {
        if (!_.has(preVertex, id)) {
          _.set(preVertex, id, v);
        } else {
          _.set(preVertex, id, deepMerge(_.get(preVertex, id), v));
        }
      });

      // re-calcuate t0 and t1
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