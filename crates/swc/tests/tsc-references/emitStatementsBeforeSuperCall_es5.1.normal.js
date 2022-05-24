import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @useDefineForClassFields: false
// @target: es2015
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Sub = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Sub, Base);
    var _super = _create_super(Sub);
    function Sub(p) {
        _class_call_check(this, Sub);
        var _this;
        console.log("hi"); // should emit before super
        _this = _super.call(this);
        _this.p = p;
        _this.field = 0;
        return _this;
    }
    return Sub;
}(Base);
var Test = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Test, Base);
    var _super = _create_super(Test);
    function Test(p) {
        _class_call_check(this, Test);
        var _this;
        1; // should emit before super
        _this = _super.call(this);
        _this.p = p;
        _this.prop = 1;
        return _this;
    }
    return Test;
}(Base);
