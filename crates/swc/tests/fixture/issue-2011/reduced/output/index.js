var a = function() {};
module.exports = (function() {
    var b, c, d, e = function() {
        "use strict";
        function e() {}
        return e.prototype.it = function() {
            this.bb = new e.MyA();
        }, e;
    }();
    return b = e, c = "MyA", d = a, c in b ? Object.defineProperty(b, c, {
        value: d,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : b[c] = d, e;
})();
