(exports = module.exports = function() {
    this.p = 1;
}).f = function(n) {
    return n + 1;
};
var C = require("./semver");
C.f(1), new C;
