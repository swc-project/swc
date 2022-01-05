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
    var d, e, f = function() {
        "use strict";
        var b, d, e;
        function f() {
            a(this, f);
        }
        return b = f, d = [
            {
                key: "it",
                value: function() {
                    this.bb = new f.MyA();
                }
            }
        ], b(b.prototype, d), e && b(b, e), f;
    }();
    return d = f, e = c, "MyA" in d ? Object.defineProperty(d, "MyA", {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : d.MyA = e, f;
})();
