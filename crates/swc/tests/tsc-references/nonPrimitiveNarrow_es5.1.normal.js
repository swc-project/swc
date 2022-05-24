import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _instanceof from "@swc/helpers/lib/_instanceof.js";
var Narrow = function Narrow() {
    "use strict";
    _class_call_check(this, Narrow);
};
var a;
if (_instanceof(a, Narrow)) {
    a.narrowed; // ok
    a = 123; // error
}
if (typeof a === "number") {
    a.toFixed(); // error, never
}
var b;
if (typeof b === "object") {
    b.toString(); // ok, object | null
} else {
    b.toString(); // error, never
}
