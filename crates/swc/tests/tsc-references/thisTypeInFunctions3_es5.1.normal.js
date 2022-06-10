import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
