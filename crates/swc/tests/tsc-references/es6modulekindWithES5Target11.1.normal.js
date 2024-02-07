//// [es6modulekindWithES5Target11.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
        this.p = 1;
    }
    var _proto = C.prototype;
    _proto.method = function method() {};
    C.x = function x() {
        return C.y;
    };
    return C;
}();
C.y = 1;
export { C as default };
C = _ts_decorate([
    foo
], C);
