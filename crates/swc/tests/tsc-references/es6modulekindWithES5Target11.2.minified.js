//// [es6modulekindWithES5Target11.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
var C = /*#__PURE__*/ function() {
    function C() {
        _class_call_check(this, C), this.p = 1;
    }
    return C.prototype.method = function() {}, C.x = function() {
        return C.y;
    }, C;
}();
C.y = 1;
_ts_decorate([
    foo
], C);
export { C as default };
