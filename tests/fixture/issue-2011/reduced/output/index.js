function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(c, d) {
    for(var e = 0; e < d.length; e++){
        var f = d[e];
        f.enumerable = f.enumerable || !1, f.configurable = !0, "value" in f && (f.writable = !0), Object.defineProperty(c, f.key, f);
    }
}
function _createClass(b, g, h) {
    return g && _defineProperties(b.prototype, g), h && _defineProperties(b, h), b;
}
function _defineProperty(i, j, k) {
    return j in i ? Object.defineProperty(i, j, {
        value: k,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : i[j] = k, i;
}
var ClassA = function ClassA() {
    "use strict";
    _classCallCheck(this, ClassA);
};
module.exports = (function() {
    var l = function() {
        "use strict";
        function l() {
            _classCallCheck(this, l);
        }
        return _createClass(l, [
            {
                key: "it",
                value: function() {
                    this.bb = new l.MyA();
                }
            }
        ]), l;
    }();
    return _defineProperty(l, "MyA", ClassA), l;
})();
