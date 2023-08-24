//// [node.d.ts]
//// [semver.js]
/// <reference path='node.d.ts' />
(exports = module.exports = function() {
    this.p = 1;
}).f = function(n) {
    return n + 1;
};
//// [index.js]
/// <reference path='node.d.ts' />
var C = require("./semver");
C.f(1), new C;
