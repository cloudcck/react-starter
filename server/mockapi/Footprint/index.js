/**
 * Created by cloud_chan on 7/25/16.
 */

const faker = require('faker');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const process = require('process');
const here = path.resolve()
module.exports = (function () {
  let router = require('express').Router();
  router.get('/:taskId/:endpointId', getFootprintsByTaskIdAndEndpointId)
  return router;

  function getFootprintsByTaskIdAndEndpointId(req, res) {
    let mock = true;
    if (mock) {

      const file = path.resolve(process.cwd(),'server/mockapi/Footprint','mock.data.json');

      let data = fs.readFileSync(file,'utf8');
      res.send(JSON.parse(data));

    } else {
      console.log('getFootprintsByTaskIdAndEndpointId', req.params);
      var objects = [], activities = [], metas = [];

      var metaTypes = [101, 102, 107, 108, 109, 104, 1113, 115, 117, 105, 114, 116, 300, 402, 403, 404, 501, 500, 1202, 1203, 1204];

      var metaCount = _.random(30);
      for (var i = 1; i <= metaCount; i++) {
        var meta = {
          metaId: i,
          metaType: metaTypes[_.random(metaTypes.length - 1)],
          metaValue: faker.system.commonFileName()
        };
        metas.push(meta)
      }


      for (var i = 1; i <= 20; i++) {
        var obj = {
          id: '' + i,
          type: _.random(4),
          title: faker.system.fileName()
        };


        obj.grid = _.random(2);
        obj.wrs = _.random(1);
        obj.globalCensus = _.random(1);
        obj.localCensus = _.random(1);
        obj.isSuspicious = obj.grid > 1 || obj.wrs || obj.globalCensus || obj.localCensus;
        obj.hasMoreChild = faker.random.boolean();
        obj.hasMoreParent = faker.random.boolean();
        var _metas = [];

        for (var x = 1; x <= 7; x++) {
          _metas.push(metas[_.random(metas.length - 2)].metaId)
        }
        obj.metas = _metas;
        objects.push(obj);
      }


      activities.push({ from: '1', to: '2', operation: _.random(4) });
      activities.push({ from: '2', to: '3', operation: _.random(4) });
      activities.push({ from: '3', to: '4', operation: _.random(4) });
      activities.push({ from: '4', to: '5', operation: _.random(4) });
      activities.push({ from: '5', to: '6', operation: _.random(4) });
      activities.push({ from: '6', to: '7', operation: _.random(4) });
      activities.push({ from: '7', to: '11', operation: _.random(4) });
      activities.push({ from: '8', to: '11', operation: _.random(4) });
      activities.push({ from: '9', to: '11', operation: _.random(4) });
      activities.push({ from: '10', to: '11', operation: _.random(4) });
      activities.push({ from: '11', to: '15', operation: _.random(4) });
      activities.push({ from: '12', to: '13', operation: _.random(4) });
      activities.push({ from: '13', to: '14', operation: _.random(4) });
      activities.push({ from: '14', to: '15', operation: _.random(4) });
      activities.push({ from: '15', to: '16', operation: _.random(4) });
      activities.push({ from: '16', to: '17', operation: _.random(4) });
      activities.push({ from: '17', to: '18', operation: _.random(4) });
      activities.push({ from: '18', to: '20', operation: _.random(4) });
      activities.push({ from: '19', to: '20', operation: _.random(4) });


      res.send({ Code: 0, Message: 'OK', Data: { objects: objects, activities: activities, metas: metas } });
    }




  }
})();

