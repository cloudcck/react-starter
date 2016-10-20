const _ = require('lodash');
const faker = require('faker');
function random(count) {
  const parentId = _.random(200);
  let fakeData = {
    "processChain": [],
    "serverMeta": []
  }
  const _metaHashId = _.random(3980925849097472000);
  fakeData.processChain.push(randomProcessChain(-1, parentId, _metaHashId));
  fakeData.serverMeta.push(randomMeta(_metaHashId));

  for (let i = 0; i < count; i++) {
    const metaHashId = _.random(3980925849097472000);
    const objectId = _.random(100,1000);
    fakeData.processChain.push(randomProcessChain(parentId, objectId, metaHashId));
    fakeData.serverMeta.push(randomMeta(metaHashId));
  }
  return fakeData;
}

function randomProcessChain(parentId, objectId, metaHashId) {

  return {
    "processId": 1,
    "objectId": objectId,
    "parentId": parentId,
    "isProcess": true,
    "operation": [
      _.random(1, 4)
    ],
    "objectDetail": [
      {
        "metaLinkId": _.random(8563228413029643000),
        "objectType": 2,
        "operation": 0,
        "metaHashId": [metaHashId],
        "timestamp": faker.date.past()
      }
    ]
  }
}
function randomMeta(metaHashId) {
  return {
    "metaHashId": metaHashId,
    "metaValue": faker.system.fileName(),
    "metaType": 105,
    "isMatched": true
  };
}

module.exports = {
  random: random
};