//// [/a.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
export var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
//// [/b.ts]
var A;
var B;
var t = {
    // error: while you can ask for `typeof types.A`,
    // `typeof types` does not include `A`
    A: undefined,
    B: undefined
};
export { };
