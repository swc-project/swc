//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Z = /*#__PURE__*/ function() {
    "use strict";
    function Z() {
        _class_call_check(this, Z);
    }
    var _proto = Z.prototype;
    _proto.f = function f() {
        var x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
        return [
            x,
            y
        ];
    };
    return Z;
}();
