//// [nonPrimitiveNarrow.ts]
var a, b;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
_instanceof(a, function Narrow() {
    _class_call_check(this, Narrow);
}) && (a.narrowed, a = 123), 'number' == typeof a && a.toFixed(), void 0 === b || _type_of(b), b.toString();
