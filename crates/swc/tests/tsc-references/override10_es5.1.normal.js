import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @declaration: true
// @noImplicitOverride: true
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Sub, Base);
    var _super = _create_super(Sub);
    function Sub() {
        _class_call_check(this, Sub);
        return _super.apply(this, arguments);
    }
    var _proto = Sub.prototype;
    _proto.bar = function bar() {};
    return Sub;
}(Base);
