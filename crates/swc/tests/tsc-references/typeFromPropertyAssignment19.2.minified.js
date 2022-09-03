//// [types.d.ts]
//// [semver.js]
function C() {
    this.p = 1;
}
exports = module.exports = C, C.f = function(n) {
    return n + 1;
};
//// [index.js]
var C = require("./semver"), two = C.f(1);
