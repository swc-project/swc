import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var x = {
    a: "test",
    b: 42
};
module.exports = x // Should fail, I1 not exported.
;
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
module.exports = C1 // Should fail, type I1 of visible member C1.m1 not exported.
;
var C1 = function C1() {
    "use strict";
    _class_call_check(this, C1);
};
module.exports = C1 // Should work, private type I1 of visible class C1 only used in private member m1.
;
// @Filename: foo1.ts
export { };
