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
var mod = require('./mod'), a = new mod.A(), b = new mod.B();
a.m('nope'), b.m('not really');
