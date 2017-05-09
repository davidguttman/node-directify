var director = require('./include/director'),
    Router = director.Router,
    routerHelper = require('./helpers'),
    extend = require('deep-extend')

var router = null;

module.exports = function(routingTable, target, options) {
  options = options || {}
  if (router) return router;
  
  if (!routingTable) throw new Error('No routing table provided. =(');

  router = new Router();
  
  router.target = target;
  router.updateParams = routerHelper.updateParams;
  router.ensureParams = routerHelper.ensureParams;
  router.param('json', routerHelper.jsonRegex);

  router.configure(extend(options, {
    before: [routerHelper.setPath, routerHelper.setParams]
  }));

  router.mount(routingTable);
  
  var dispatchCopy = router.dispatch;
  router.dispatch = function(method, fragment) {
    return dispatchCopy.call(this, method, unescape(fragment));
  };
  
  router.init();
  
  return router;
};
