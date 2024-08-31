//// [thisTypeInFunctions3.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var Test = /*#__PURE__*/ function(Base1) {
    "use strict";
    _inherits(Test, Base1);
    function Test() {
        _class_call_check(this, Test);
        return _call_super(this, Test, arguments);
    }
    var _proto = Test.prototype;
    _proto.m = function m() {
        this.check(this);
    };
    return Test;
}(Base);
