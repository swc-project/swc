import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
export var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.m = function() {
        return _instanceof(this, D);
    }, C;
}();
var D = function(C) {
    "use strict";
    _inherits(D, C);
    var _super = _create_super(D);
    function D() {
        return _class_call_check(this, D), _super.apply(this, arguments);
    }
    return D;
}(C);
