import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var A = function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    return _proto.m1 = function() {
        return 0;
    }, _proto.m2 = function() {
        return 0;
    }, _proto.m3 = function() {}, A;
}(), B = function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        return _class_call_check(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.m1 = function() {
        return 10;
    }, _proto.m2 = function() {
        return 30;
    }, _proto.m3 = function() {}, B;
}(A);
