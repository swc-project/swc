//// [types.d.ts]
//// [minimatch.js]
/// <reference path='./types.d.ts'/>
module.exports = minimatch;
minimatch.M = M;
minimatch.filter = filter;
function filter() {
    return minimatch();
}
function minimatch() {}
M.defaults = function(def) {
    return def;
};
M.prototype.m = function() {};
function M() {}
//// [use.js]
/// <reference path='./types.d.ts'/>
var mini = require('./minimatch');
mini.M.defaults();
var m = new mini.M();
m.m();
mini.filter();
