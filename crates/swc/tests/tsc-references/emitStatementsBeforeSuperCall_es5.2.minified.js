import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Sub = function(Base1) {
    "use strict";
    _inherits(Sub, Base1);
    var _super = _create_super(Sub);
    function Sub(p) {
        var _this;
        return _class_call_check(this, Sub), console.log("hi"), (_this = _super.call(this)).p = p, _this.field = 0, _this;
    }
    return Sub;
}(Base), Test = function(Base2) {
    "use strict";
    _inherits(Test, Base2);
    var _super = _create_super(Test);
    function Test(p) {
        var _this;
        return _class_call_check(this, Test), (_this = _super.call(this)).p = p, _this.prop = 1, _this;
    }
    return Test;
}(Base);
