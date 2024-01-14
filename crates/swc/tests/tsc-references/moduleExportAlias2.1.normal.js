//// [node.d.ts]
//// [semver.js]
/// <reference path='node.d.ts' />
exports1 = module.exports = C;
exports1.f = function(n) {
    return n + 1;
};
function C() {
    this.p = 1;
}
//// [index.js]
/// <reference path='node.d.ts' />
var C = require("./semver");
var two = C.f(1);
var c = new C;
