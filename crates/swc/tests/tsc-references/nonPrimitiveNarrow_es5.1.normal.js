import * as swcHelpers from "@swc/helpers";
var Narrow = function Narrow() {
    "use strict";
    swcHelpers.classCallCheck(this, Narrow);
};
var a;
if (swcHelpers._instanceof(a, Narrow)) {
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
