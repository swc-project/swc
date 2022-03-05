import * as swcHelpers from "@swc/helpers";
let a1 = swcHelpers.objectSpread({
    a: 123
}, a); // string (Error)
let b1 = swcHelpers.objectSpread({
    a: 123
}, b); // string | number
let c1 = swcHelpers.objectSpread({
    a: 123
}, c); // string | undefined (Error)
let d1 = swcHelpers.objectSpread({
    a: 123
}, d); // string | number
let a2 = swcHelpers.objectSpread({
    a: 123
}, t ? a : {}); // string | number
let b2 = swcHelpers.objectSpread({
    a: 123
}, t ? b : {}); // string | number
let c2 = swcHelpers.objectSpread({
    a: 123
}, t ? c : {}); // string | number
let d2 = swcHelpers.objectSpread({
    a: 123
}, t ? d : {}); // string | number
