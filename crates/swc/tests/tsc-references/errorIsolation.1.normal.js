//// [errorIsolation.js]
var async = {
    doSomething: function(_) {}
};
async.doSomething(/***/ function() {});
