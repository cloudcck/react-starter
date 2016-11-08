/**
 * Created by cloud_chan on 7/25/16.
 */
const api = require('./api');
module.exports = (function () {
  let router = require('express').Router();
  router.get('/:taskId/:endpointId', api.getProcessChain);
  router.get('/:taskId/:endpointId/more', api.getMore);
  router.get('/:taskId/:endpointId/:objId/parent', api.getParent);
  router.get('/:taskId/:endpointId/:objId/child', api.getChild);
  router.post('/ProcessChain_new', api.getNewProcessChain)
  return router;
})();


