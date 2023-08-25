//// [types.d.ts]
//// [semver.js]
/// <reference path='./types.d.ts'/>
function C() {
    this.p = 1;
}
exports = module.exports = C, C.f = function(n) {
    return n + 1;
};
//// [index.js]
/// <reference path='./types.d.ts'/>
require("./semver").f(1);
