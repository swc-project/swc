//// [typeParameterAsTypeArgument.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x, y) {
    return foo(y, y), new C();
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
