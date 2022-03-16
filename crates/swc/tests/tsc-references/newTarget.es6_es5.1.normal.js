import * as swcHelpers from "@swc/helpers";
// @target: es6
var A = function A() {
    "use strict";
    var _newtarget = swcHelpers._instanceof(this, A) ? this.constructor : void 0;
    swcHelpers.classCallCheck(this, A);
    this.d = function _target() {
        return swcHelpers._instanceof(this, _target) ? this.constructor : void 0;
    };
    var a = swcHelpers._instanceof(this, A) ? this.constructor : void 0;
    var b = function() {
        return _newtarget;
    };
};
A.c = function _target() {
    return swcHelpers._instanceof(this, _target) ? this.constructor : void 0;
};
var B = /*#__PURE__*/ function _target(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _newtarget = swcHelpers._instanceof(this, B) ? this.constructor : void 0;
        swcHelpers.classCallCheck(this, B);
        var _this = _super.call(this);
        var e = swcHelpers._instanceof(this, B) ? this.constructor : void 0;
        var f = function() {
            return _newtarget;
        };
        return _this;
    }
    return B;
}(A);
function f1() {
    var _newtarget = swcHelpers._instanceof(this, f1) ? this.constructor : void 0;
    var g = swcHelpers._instanceof(this, f1) ? this.constructor : void 0;
    var h = function() {
        return _newtarget;
    };
}
var f2 = function _target() {
    var _newtarget = swcHelpers._instanceof(this, _target) ? this.constructor : void 0;
    var i = swcHelpers._instanceof(this, _target) ? this.constructor : void 0;
    var j = function() {
        return _newtarget;
    };
};
var O = {
    k: function _target() {
        return swcHelpers._instanceof(this, _target) ? this.constructor : void 0;
    }
};
