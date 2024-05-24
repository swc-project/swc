//// [nonPrimitiveNarrow.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
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
if ((typeof b === "undefined" ? "undefined" : _type_of(b)) === 'object') {
    b.toString(); // ok, object | null
} else {
    b.toString(); // error, never
}
