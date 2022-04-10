import * as swcHelpers from "@swc/helpers";
(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
var X = function() {
    function X() {
        swcHelpers.classCallCheck(this, X), this.m = this.m.bind(this), this.mistake = "frankly, complete nonsense";
    }
    var _proto = X.prototype;
    return _proto.m = function() {}, _proto.mistake = function() {}, X;
}(), x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
var Y = function() {
    function Y() {
        swcHelpers.classCallCheck(this, Y), this.m = this.m.bind(this), this.mistake = "even more nonsense";
    }
    var _proto = Y.prototype;
    return _proto.mistake = function() {}, _proto.m = function() {}, Y;
}();
Y.prototype.mistake = !0;
var y = new Y();
y.m(), y.mistake();
