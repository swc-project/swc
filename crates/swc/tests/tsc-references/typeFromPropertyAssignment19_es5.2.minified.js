function C() {
    this.p = 1;
}
exports = module.exports = C, C.f = function(n) {
    return n + 1;
};
var C = require("./semver");
C.f(1);
