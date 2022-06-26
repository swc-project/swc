import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// These are all errors because type parameters cannot reference other type parameters from the same list
function foo(x, y) {
    foo(y, y);
    return new C();
}
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
