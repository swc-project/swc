import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _create_class from "@swc/helpers/lib/_create_class.js";
//@target: ES6
//@declaration: true
var M;
(function(M1) {
    var _toPrimitive = Symbol.toPrimitive, _isConcatSpreadable = Symbol.isConcatSpreadable, _toPrimitive1 = Symbol.toPrimitive, _toPrimitive2 = Symbol.toPrimitive;
    var C = /*#__PURE__*/ function() {
        "use strict";
        function C() {
            _class_call_check(this, C);
        }
        var _proto = C.prototype;
        _proto[_toPrimitive] = function(x) {};
        _proto[_isConcatSpreadable] = function() {
            return undefined;
        };
        _create_class(C, [
            {
                key: _toPrimitive1,
                get: function get() {
                    return undefined;
                }
            },
            {
                key: _toPrimitive2,
                set: function set(x) {}
            }
        ]);
        return C;
    }();
    M1.C = C;
})(M || (M = {}));
