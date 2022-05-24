import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
var X = function() {
    "use strict";
    function X() {
        _class_call_check(this, X), this.m = this.m.bind(this), this.mistake = "frankly, complete nonsense";
    }
    var _proto = X.prototype;
    return _proto.m = function() {}, _proto.mistake = function() {}, X;
}(), x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
var Y = function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y), this.m = this.m.bind(this), this.mistake = "even more nonsense";
    }
    var _proto = Y.prototype;
    return _proto.mistake = function() {}, _proto.m = function() {}, Y;
}();
Y.prototype.mistake = !0;
var y = new Y();
y.m(), y.mistake();
