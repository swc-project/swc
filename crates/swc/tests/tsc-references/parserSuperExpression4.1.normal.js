//// [parserSuperExpression4.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _set } from "@swc/helpers/_/_set";
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
(function(M1) {
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
    })(M1.M2 || (M1.M2 = {}));
})(M1 || (M1 = {}));
var M1;
