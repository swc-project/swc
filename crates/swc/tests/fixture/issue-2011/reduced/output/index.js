function a(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function b(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
var c = function() {
    "use strict";
    a(this, c);
};
module.exports = (function() {
    var d, e, f, g = function() {
        "use strict";
        var b, d, e;
        function g() {
            a(this, g);
        }
        return b = g, d = [
            {
                key: "it",
                value: function() {
                    this.bb = new g.MyA();
                }
            }
        ], b(b.prototype, d), e && b(b, e), g;
    }();
    return d = g, e = "MyA", f = c, e in d ? Object.defineProperty(d, e, {
        value: f,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : d[e] = f, g;
})();
