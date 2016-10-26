/**
 * Created by cloud_chan on 7/25/16.
 */

const faker = require('faker');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const process = require('process');
const fake = require('./fake');
const here = path.resolve();
const moment = require('moment');
const loki = require('lokijs');

let db = new loki('loki.json');
let processChainCollection = db.addCollection('processChain')



const readSample = (req, res) => {
  const file = path.resolve(process.cwd(), 'server/mockapi/Footprint', 'sample.txt');
  const lines = fs.readFileSync(file, 'utf8').toString().split('\n');
  const regex = /^(\w)(?:\s)(\w)(?:\s)(\d{4}-\d{2}-\d{2})(?:\s)(.+)$/;
  let json = [];
  lines.map(l => {
    const data = regex.exec(l);
    let [, pid, oid, unixTime, op] = data;
    let opTime = moment(unixTime, "YYYY-MM-DD").add(_.random(86400 / 60, 'minutes')).unix();
    let row = { pid, oid, opTime, op };
    processChainCollection.insert(row);
    json.push(row);
  });
  res.send({ Code: 0, Message: 'OK', Data: json });
}

const getParent = (req, res) => {
  const dataFromLoki = processChainCollection.findOne({ 'oid': { '$eq': req.params.objId } });
  let oid, opTime;
  if (dataFromLoki) {
    opTime = moment.unix(dataFromLoki.opTime).subtract(_.random(100), 'hours').unix();
    console.log('11 ',dataFromLoki.opTime - opTime);
  } else {
    let newRecord = processChainCollection.findOne({ 'pid': { '$eq': req.params.objId } });
    opTime = moment.unix(newRecord.opTime).subtract(_.random(100), 'hours').unix();
    console.log('22 ',newRecord.opTime - opTime);
    let row = {
      pid: `${req.params.objId}_p0`,
      oid: req.params.objId,
      opTime: opTime,
      op: 'fake op'
    };
    processChainCollection.insert(row);
  }
  // console.log('aaa -->', JSON.stringify(aaa, '', 2));
  let data = { Code: 0, Message: 'OK', Data: [] };
  for (let i = 1; i <= 3; i++) {
    let row = {
      pid: `${req.params.objId}_p${i}`,
      oid: req.params.objId,
      opTime: opTime,
      op: 'fake_parent'
    };
    processChainCollection.insert(row);
    data.Data.push(row);
  }
  res.send(data);
}
const getChild = (req, res) => {
  const dataFromLoki = processChainCollection.findOne({ 'oid': { '$eq': req.params.objId } });
  let oid, opTime;
  if (dataFromLoki) {
    opTime = moment.unix(dataFromLoki.opTime).add(_.random(100), 'hours').unix();
    console.log('11 ',dataFromLoki.opTime - opTime);
  } else {
    let newRecord = processChainCollection.findOne({ 'pid': { '$eq': req.params.objId } });
    opTime = moment.unix(newRecord.opTime).add(_.random(100), 'hours').unix();
    console.log('22 ',newRecord.opTime - opTime);
    let row = {
      pid: `${req.params.objId}_c0`,
      oid: req.params.objId,
      opTime: opTime,
      op: 'fake op'
    };
    processChainCollection.insert(row);
  }
  // console.log('aaa -->', JSON.stringify(aaa, '', 2));
  let data = { Code: 0, Message: 'OK', Data: [] };
  for (let i = 1; i <= 3; i++) {
    let row = {
      pid: `${req.params.objId}_c${i}`,
      oid: req.params.objId,
      opTime: opTime,
      op: 'fake_child'
    };
    processChainCollection.insert(row);
    data.Data.push(row);
  }
  res.send(data);
}

const getMore = (req, res) => {
  let data = {
    "Code": 0,
    "Message": "OK",
    "Data": {
      "pluginTaskResult": {
        "taskId": "",
        "statusCode": 0
      }
    }
  }
  let randomData = fake.random(100);
  data.Data.processChain = randomData.processChain;
  data.Data.serverMeta = randomData.serverMeta;
  res.send(data);
}




module.exports = (function () {
  let router = require('express').Router();
  router.get('/:taskId/:endpointId', readSample);
  router.get('/:taskId/:endpointId/more', getMore);
  router.get('/:taskId/:endpointId/:objId/parent', getParent);
  router.get('/:taskId/:endpointId/:objId/child', getChild);
  return router;
})();


