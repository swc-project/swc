//// [input.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
function C() {
    this.m = null;
}
C.prototype.m = function() {
    this.nothing();
};
var X = /*#__PURE__*/ function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
        this.m = this.m.bind(this);
        this.mistake = 'frankly, complete nonsense';
    }
    var _proto = X.prototype;
    _proto.m = function m() {};
    _proto.mistake = function mistake() {};
    return X;
}();
var x = new X();
X.prototype.mistake = false;
x.m();
x.mistake;
var Y = /*#__PURE__*/ function() {
    "use strict";
    function Y() {
        _class_call_check(this, Y);
        this.m = this.m.bind(this);
        this.mistake = 'even more nonsense';
    }
    var _proto = Y.prototype;
    _proto.mistake = function mistake() {};
    _proto.m = function m() {};
    return Y;
}();
Y.prototype.mistake = true;
var y = new Y();
y.m();
y.mistake();
