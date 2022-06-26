import _object_spread from "@swc/helpers/src/_object_spread.mjs";
let a1 = _object_spread({
    a: 123
}, a); // string (Error)
let b1 = _object_spread({
    a: 123
}, b); // string | number
let c1 = _object_spread({
    a: 123
}, c); // string | undefined (Error)
let d1 = _object_spread({
    a: 123
}, d); // string | number | undefined
let a2 = _object_spread({
    a: 123
}, t ? a : {}); // string | number
let b2 = _object_spread({
    a: 123
}, t ? b : {}); // string | number
let c2 = _object_spread({
    a: 123
}, t ? c : {}); // string | number | undefined
let d2 = _object_spread({
    a: 123
}, t ? d : {}); // string | number | undefined
