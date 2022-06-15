import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Test = function(Base1) {
    "use strict";
    _inherits(Test, Base1);
    var _super = _create_super(Test);
    function Test() {
        return _class_call_check(this, Test), _super.apply(this, arguments);
    }
    return Test.prototype.m = function() {
        this.check(this);
    }, Test;
}(Base);
