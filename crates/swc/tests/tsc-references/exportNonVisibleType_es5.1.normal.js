// @Filename: foo1.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x = {
    a: "test",
    b: 42
};
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
module.exports = x; // Should fail, I1 not exported.
export { }; // Should work, private type I1 of visible class C1 only used in private member m1.
