import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _set from "@swc/helpers/lib/_set.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {
        _set(_get_prototype_of(C.prototype), "foo", 1, this, true);
    };
    return C;
}();
var M1;
(function(M11) {
    var M2;
    (function(M2) {
        var C = /*#__PURE__*/ function() {
            "use strict";
            function C() {
                _class_call_check(this, C);
            }
            var _proto = C.prototype;
            _proto.foo = function foo() {
                _set(_get_prototype_of(C.prototype), "foo", 1, this, true);
            };
            return C;
        }();
    })(M2 = M11.M2 || (M11.M2 = {}));
})(M1 || (M1 = {}));
