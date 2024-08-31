//// [a.js]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var _this = this, B = /*#__PURE__*/ function() {
    function B() {
        _class_call_check(this, B), this.n = 1;
    }
    return B.prototype.foo = function() {}, B;
}();
/*#__PURE__*/ (function(B) {
    function C() {
        return _class_call_check(this, C), _call_super(this, C, arguments);
    }
    return _inherits(C, B), C;
})(B).prototype.foo = function() {}, /*#__PURE__*/ function(B) {
    function D() {
        return _class_call_check(this, D), _call_super(this, D, arguments);
    }
    return _inherits(D, B), D;
}(B).prototype.foo = function() {
    _this.n = 'not checked, so no error';
};
var Module = function Module() {
    _class_call_check(this, Module);
};
Module.prototype.identifier = void 0, Module.prototype.size = null;
