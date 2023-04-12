//// [thisTypeInFunctions3.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Test = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Test, Base1);
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
