//// [types.d.ts]
//// [minimatch.js]
module.exports = minimatch;
minimatch.M = M;
minimatch.filter = function() {
    return minimatch();
};
function minimatch() {}
M.defaults = function(def) {
    return def;
};
M.prototype.m = function() {};
function M() {}
//// [use.js]
var mini = require("./minimatch");
mini.M.defaults();
new mini.M().m();
mini.filter();
