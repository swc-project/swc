//// [types.d.ts]
//// [semver.js]
exports = module.exports = C;
C.f = function(n) {
    return n + 1;
};
function C() {
    this.p = 1;
}
//// [index.js]
require("./semver").f(1);
