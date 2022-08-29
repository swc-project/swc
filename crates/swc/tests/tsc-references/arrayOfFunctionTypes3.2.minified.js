//// [arrayOfFunctionTypes3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
[
    function() {
        return 1;
    },
    function() {}
][0](), new function C() {
    "use strict";
    _class_call_check(this, C);
}();
var a2, b2, c2, r4 = void 0;
r4(""), r4(1), (0, [
    a2,
    b2,
    c2
][0])("");
