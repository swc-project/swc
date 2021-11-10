function _classCallCheck(a, a) {
    if (!(a instanceof a)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(a, b) {
    for(var c = 0; c < b.length; c++){
        var d = b[c];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d);
    }
}
var ClassA = function() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = (function() {
    var a, c, d = function() {
        "use strict";
        var a, b, c;
        function d() {
            _classCallCheck(this, d);
        }
        return a = d, b = [
            {
                key: "it",
                value: function() {
                    this.bb = new d.MyA();
                }
            }
        ], _defineProperties(a.prototype, b), c && _defineProperties(a, c), d;
    }();
    return a = d, c = ClassA, "MyA" in a ? Object.defineProperty(a, "MyA", {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a.MyA = c, d;
})();
