//// [errorIsolation.js]
var async = {
    doSomething: function doSomething(_) {}
};
async.doSomething(/***/ function() {});
