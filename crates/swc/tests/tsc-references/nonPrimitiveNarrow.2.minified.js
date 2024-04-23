//// [nonPrimitiveNarrow.ts]
var a, b;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
_instanceof(a, function Narrow() {
    _class_call_check(this, Narrow);
}) && (a.narrowed, a = 123), 'number' == typeof a && a.toFixed(), b.toString();
