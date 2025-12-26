//// [newTarget.es5.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var A = function A() {
    "use strict";
    var _this = this;
    _class_call_check(this, A);
    this.d = function _target() {
        return _instanceof(this, _target) ? this.constructor : void 0;
    };
    var a = _instanceof(this, A) ? this.constructor : void 0;
    var b = function() {
        return _instanceof(_this, A) ? _this.constructor : void 0;
    };
};
A.c = function _target() {
    return _instanceof(this, _target) ? this.constructor : void 0;
};
var B = /*#__PURE__*/ function _target(A) {
    "use strict";
    _inherits(B, A);
    function B() {
        var _this = this;
        _class_call_check(this, B);
        var _this1;
        _this1 = _call_super(this, B);
        var e = _instanceof(this, B) ? this.constructor : void 0;
        var f = function() {
            return _instanceof(_this, B) ? _this.constructor : void 0;
        };
        return _this1;
    }
    return B;
}(A);
function f1() {
    var _this = this;
    var g = _instanceof(this, f1) ? this.constructor : void 0;
    var h = function() {
        return _instanceof(_this, f1) ? _this.constructor : void 0;
    };
}
var f2 = function _target() {
    var _this = this;
    var i = _instanceof(this, _target) ? this.constructor : void 0;
    var j = function() {
        return _instanceof(_this, _target) ? _this.constructor : void 0;
    };
};
var O = {
    k: function _target() {
        return _instanceof(this, _target) ? this.constructor : void 0;
    }
};
