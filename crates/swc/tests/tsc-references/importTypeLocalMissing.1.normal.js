//// [foo.ts]
//! 
//!   x Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead.
//!    ,----
//!  5 | export = Point;
//!    : ^^^^^^^^^^^^^^^
//!    `----
//// [foo2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Bar = function Bar(input) {
    "use strict";
    _class_call_check(this, Bar);
};
export { Bar };
//// [usage.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var x = {
    x: 0,
    y: 0
};
export var y = {
    a: "",
    b: 0
};
export var z = {
    a: "",
    b: 0
};
export var Bar2 = function Bar2(input) {
    "use strict";
    _class_call_check(this, Bar2);
};
export var shim = {
    Bar: Bar2
};
