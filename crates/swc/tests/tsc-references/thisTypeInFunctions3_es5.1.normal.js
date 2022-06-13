import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Test = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Test, Base);
    var _super = _create_super(Test);
    function Test() {
        _class_call_check(this, Test);
        return _super.apply(this, arguments);
    }
    var _proto = Test.prototype;
    _proto.m = function m() {
        this.check(this);
    };
    return Test;
}(Base);
