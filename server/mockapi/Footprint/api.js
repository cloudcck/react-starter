const faker = require('faker');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const process = require('process');
const here = path.resolve();
const moment = require('moment');
const loki = require('lokijs');

let db = new loki('loki.json');
let processChainCollection = db.addCollection('processChain')

const getProcessChain = (req, res) => {
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
  // console.log('json =>', JSON.stringify(json));
  res.send({ Code: 0, Message: 'OK', Data: json });
}

const getParent = (req, res) => {
  const dataFromLoki = processChainCollection.findOne({ 'oid': { '$eq': req.params.objId } });
  let oid, opTime;
  if (dataFromLoki) {
    opTime = moment.unix(dataFromLoki.opTime).subtract(_.random(100), 'hours').unix();
    console.log('11 ', dataFromLoki.opTime - opTime);
  } else {
    let newRecord = processChainCollection.findOne({ 'pid': { '$eq': req.params.objId } });
    opTime = moment.unix(newRecord.opTime).subtract(_.random(100), 'hours').unix();
    console.log('22 ', newRecord.opTime - opTime);
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
  for (let i = 1; i <= 2; i++) {
    let row = {
      pid: `${i}${req.params.objId}`,
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
  } else {
    let newRecord = processChainCollection.findOne({ 'pid': { '$eq': req.params.objId } });
    opTime = moment.unix(newRecord.opTime).add(_.random(100), 'hours').unix();
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
  for (let i = 1; i <= 2; i++) {
    let row = {
      pid: req.params.objId,
      oid: `${req.params.objId}${i}`,
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

const getNewProcessChain = (req, res) => {
  const file = path.resolve(process.cwd(), 'server/mockapi/Footprint', 'ProcessChain.new.json');
  const str = fs.readFileSync(file, 'utf8');
  res.send(JSON.parse(str));
}

module.exports = { getChild, getMore, getParent, getProcessChain, getNewProcessChain };