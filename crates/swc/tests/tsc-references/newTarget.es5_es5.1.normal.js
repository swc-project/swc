import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: es5
var A = function A() {
    "use strict";
    var _newtarget = _instanceof(this, A) ? this.constructor : void 0;
    _class_call_check(this, A);
    this.d = function _target() {
        return _instanceof(this, _target) ? this.constructor : void 0;
    };
    var a = _instanceof(this, A) ? this.constructor : void 0;
    var b = function() {
        return _newtarget;
    };
};
A.c = function _target() {
    return _instanceof(this, _target) ? this.constructor : void 0;
};
var B = /*#__PURE__*/ function _target(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        var _newtarget = _instanceof(this, B) ? this.constructor : void 0;
        _class_call_check(this, B);
        var _this = _super.call(this);
        var e = _instanceof(this, B) ? this.constructor : void 0;
        var f = function() {
            return _newtarget;
        };
        return _this;
    }
    return B;
}(A);
function f1() {
    var _newtarget = _instanceof(this, f1) ? this.constructor : void 0;
    var g = _instanceof(this, f1) ? this.constructor : void 0;
    var h = function() {
        return _newtarget;
    };
}
var f2 = function _target() {
    var _newtarget = _instanceof(this, _target) ? this.constructor : void 0;
    var i = _instanceof(this, _target) ? this.constructor : void 0;
    var j = function() {
        return _newtarget;
    };
};
var O = {
    k: function _target() {
        return _instanceof(this, _target) ? this.constructor : void 0;
    }
};
