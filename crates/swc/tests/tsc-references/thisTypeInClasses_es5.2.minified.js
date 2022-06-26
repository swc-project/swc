import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C1 = function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.f = function(x) {}, C1;
}(), C2 = function() {
    "use strict";
    _class_call_check(this, C2);
}, C3 = function() {
    "use strict";
    _class_call_check(this, C3);
}, C5 = function() {
    "use strict";
    function C5() {
        _class_call_check(this, C5);
    }
    var _proto = C5.prototype;
    return _proto.foo = function() {}, _proto.bar = function() {}, C5;
}();
