//// [types.d.ts]
//// [semver.js]
/// <reference path='./types.d.ts'/>
exports1 = module.exports = C;
C.f = function(n) {
    return n + 1;
};
function C() {
    this.p = 1;
}
//// [index.js]
/// <reference path='./types.d.ts'/>
var C = require("./semver");
var two = C.f(1);
