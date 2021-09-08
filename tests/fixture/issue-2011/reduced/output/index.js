function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(c, d) {
    for(var e = 0; e < d.length; e++){
        var f = d[e];
        f.enumerable = f.enumerable || !1, f.configurable = !0, "value" in f && (f.writable = !0), Object.defineProperty(c, f.key, f);
    }
}
var ClassA = function() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = (function() {
    var g, h, i = function() {
        "use strict";
        function i() {
            _classCallCheck(this, i);
        }
        var b, j, k;
        return b = i, j = [
            {
                key: "it",
                value: function() {
                    this.bb = new i.MyA();
                }
            }
        ], _defineProperties(b.prototype, j), k && _defineProperties(b, k), i;
    }();
    return g = i, h = ClassA, "MyA" in g ? Object.defineProperty(g, "MyA", {
        value: h,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : g.MyA = h, i;
})();
