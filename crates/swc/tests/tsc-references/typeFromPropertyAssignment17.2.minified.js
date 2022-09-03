//// [types.d.ts]
//// [minimatch.js]
function filter() {
    return minimatch();
}
function minimatch() {}
function M() {}
module.exports = minimatch, minimatch.M = M, minimatch.filter = filter, M.defaults = function(def) {
    return def;
}, M.prototype.m = function() {};
//// [use.js]
var mini = require("./minimatch");
mini.M.defaults();
var m = new mini.M();
m.m(), mini.filter();
