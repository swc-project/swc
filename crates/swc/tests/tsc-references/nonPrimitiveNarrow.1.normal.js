//// [nonPrimitiveNarrow.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
var Narrow = function Narrow() {
    "use strict";
    _class_call_check(this, Narrow);
};
var a;
if (_instanceof(a, Narrow)) {
    a.narrowed; // ok
    a = 123; // error
}
if (typeof a === 'number') {
    a.toFixed(); // error, never
}
var b;
if (typeof b === 'object') {
    b.toString(); // ok, object | null
} else {
    b.toString(); // error, never
}
