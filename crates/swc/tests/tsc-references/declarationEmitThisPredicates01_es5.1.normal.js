import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _instanceof from "@swc/helpers/src/_instanceof.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @declaration: true
// @module: commonjs
export var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.m = function m() {
        return _instanceof(this, D);
    };
    return C;
}();
export var D = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        _class_call_check(this, D);
        return _super.apply(this, arguments);
    }
    return D;
}(C);
