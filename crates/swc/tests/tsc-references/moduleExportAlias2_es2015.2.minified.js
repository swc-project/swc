(exports = module.exports = function() {
    this.p = 1;
}).f = (n)=>n + 1;
const C = require("./semver");
C.f(1), new C;
