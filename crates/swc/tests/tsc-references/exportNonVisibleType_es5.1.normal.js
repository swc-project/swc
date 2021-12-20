function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var x = {
    a: "test",
    b: 42
};
module.exports = x // Should fail, I1 not exported.
;
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
module.exports = C1 // Should fail, type I1 of visible member C1.m1 not exported.
;
var C1 = function C1() {
    "use strict";
    _classCallCheck(this, C1);
};
module.exports = C1 // Should work, private type I1 of visible class C1 only used in private member m1.
;
// @Filename: foo1.ts
export { };
