//// [bar.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
export var Z = /*#__PURE__*/ function() {
    function Z() {
        _class_call_check(this, Z);
    }
    return Z.prototype.f = function() {
        var x = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, y = arguments.length > 1 ? arguments[1] : void 0;
        return [
            x,
            y
        ];
    }, Z;
}();
