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
module.exports = C1 // Should work, private type I1 of visible class C1 only used in private member m1.
;
// @Filename: foo1.ts
export { };
