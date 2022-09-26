//// [types.d.ts]
//// [mod.js]
var A = function() {
    this.a = 1;
}, B = function() {
    this.b = 2;
};
exports.A = A, exports.B = B, A.prototype = B.prototype = {
    m: function(n) {
        return n + 1;
    }
};
//// [use.js]
var mod = require("./mod");
new mod.A().m("nope"), new mod.B().m("not really");
