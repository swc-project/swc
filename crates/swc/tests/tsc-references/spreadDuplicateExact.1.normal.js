//// [spreadDuplicateExact.ts]
// Repro from #44438
import _extends from "@swc/helpers/src/_extends.mjs";
var a1 = _extends({
    a: 123
}, a); // string (Error)
var b1 = _extends({
    a: 123
}, b); // string | number
var c1 = _extends({
    a: 123
}, c); // string | undefined (Error)
var d1 = _extends({
    a: 123
}, d); // string | number | undefined
var a2 = _extends({
    a: 123
}, t ? a : {}); // string | number
var b2 = _extends({
    a: 123
}, t ? b : {}); // string | number
var c2 = _extends({
    a: 123
}, t ? c : {}); // string | number | undefined
var d2 = _extends({
    a: 123
}, t ? d : {}); // string | number | undefined
