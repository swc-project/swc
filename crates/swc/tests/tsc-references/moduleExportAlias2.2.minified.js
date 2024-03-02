//// [node.d.ts]
//// [semver.js]
(exports = module.exports = function() {
    this.p = 1;
}).f = function(n) {
    return n + 1;
};
//// [index.js]
var C = require("./semver");
C.f(1), new C;
