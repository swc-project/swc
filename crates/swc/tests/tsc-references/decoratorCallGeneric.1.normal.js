//// [decoratorCallGeneric.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
function dec(c) {}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.m = function m() {};
    return C;
}();
C = _ts_decorate([
    dec
], C);
