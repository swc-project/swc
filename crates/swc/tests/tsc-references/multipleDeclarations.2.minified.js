//// [input.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function() {
    this.m = null;
}).prototype.m = function() {
    this.nothing();
};
var X = /*#__PURE__*/ function() {
    function X() {
        _class_call_check(this, X), this.m = this.m.bind(this), this.mistake = 'frankly, complete nonsense';
    }
    var _proto = X.prototype;
    return _proto.m = function() {}, _proto.mistake = function() {}, X;
}(), x = new X();
X.prototype.mistake = !1, x.m(), x.mistake;
var Y = /*#__PURE__*/ function() {
    function Y() {
        _class_call_check(this, Y), this.m = this.m.bind(this), this.mistake = 'even more nonsense';
    }
    var _proto = Y.prototype;
    return _proto.mistake = function() {}, _proto.m = function() {}, Y;
}();
Y.prototype.mistake = !0;
var y = new Y();
y.m(), y.mistake();
