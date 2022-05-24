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
    function Sub() {
        return _class_call_check(this, Sub), _super.apply(this, arguments);
    }
    return Sub.prototype.bar = function() {}, Sub;
}(Base);
