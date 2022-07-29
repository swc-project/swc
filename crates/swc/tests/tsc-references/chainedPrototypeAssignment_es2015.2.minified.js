var A = function() {
    this.a = 1;
}, B = function() {
    this.b = 2;
};
exports.A = A, exports.B = B, A.prototype = B.prototype = {
    m (n) {
        return n + 1;
    }
};
var mod = require('./mod'), a = new mod.A(), b = new mod.B();
a.m('nope'), b.m('not really');
