import _object_spread from "@swc/helpers/lib/_object_spread.js";
var a1 = _object_spread({
    a: 123
}, a); // string (Error)
var b1 = _object_spread({
    a: 123
}, b); // string | number
var c1 = _object_spread({
    a: 123
}, c); // string | undefined (Error)
var d1 = _object_spread({
    a: 123
}, d); // string | number
var a2 = _object_spread({
    a: 123
}, t ? a : {}); // string | number
var b2 = _object_spread({
    a: 123
}, t ? b : {}); // string | number
var c2 = _object_spread({
    a: 123
}, t ? c : {}); // string | number
var d2 = _object_spread({
    a: 123
}, t ? d : {}); // string | number
