import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
function foo() {}
var x = new foo(); // can be used as a constructor function
var C = /*#__PURE__*/ function(foo1) {
    "use strict";
    _inherits(C, foo1);
    var _super = _create_super(C);
    function C() {
        _class_call_check(this, C);
        return _super.apply(this, arguments);
    }
    return C;
} // error, cannot extend it though
(foo);
