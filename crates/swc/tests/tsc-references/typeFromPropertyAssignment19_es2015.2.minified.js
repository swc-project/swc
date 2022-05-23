function C() {
    this.p = 1;
}
exports = module.exports = C, C.f = (n)=>n + 1;
const C = require("./semver");
C.f(1);
