import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var Base = function() {
    "use strict";
    _class_call_check(this, Base);
}, Sub = function(Base) {
    "use strict";
    _inherits(Sub, Base);
    var _super = _create_super(Sub);
    function Sub() {
        return _class_call_check(this, Sub), _super.apply(this, arguments);
    }
    return Sub.prototype.bar = function() {}, Sub;
}(Base);
