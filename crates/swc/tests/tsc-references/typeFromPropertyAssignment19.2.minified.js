//// [types.d.ts]
//// [semver.js]
function C() {
    this.p = 1;
}
exports = module.exports = C, C.f = function(n) {
    return n + 1;
};
//// [index.js]
require("./semver").f(1);
