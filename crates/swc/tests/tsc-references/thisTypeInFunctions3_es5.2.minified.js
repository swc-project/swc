import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Test = function(Base) {
    "use strict";
    _inherits(Test, Base);
    var _super = _create_super(Test);
    function Test() {
        return _class_call_check(this, Test), _super.apply(this, arguments);
    }
    return Test.prototype.m = function() {
        this.check(this);
    }, Test;
}(Base);
