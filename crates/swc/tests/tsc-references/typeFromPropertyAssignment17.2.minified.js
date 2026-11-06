//// [types.d.ts]
//// [minimatch.js]
function minimatch() {}
function M() {}
module.exports = minimatch, minimatch.M = M, minimatch.filter = function() {}, M.defaults = function(def) {
    return def;
}, M.prototype.m = function() {};
//// [use.js]
var mini = require('./minimatch');
mini.M.defaults(), new mini.M().m(), mini.filter();
