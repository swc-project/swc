import * as swcHelpers from "@swc/helpers";
var a1 = swcHelpers.objectSpread({
    a: 123
}, a); // string (Error)
var b1 = swcHelpers.objectSpread({
    a: 123
}, b); // string | number
var c1 = swcHelpers.objectSpread({
    a: 123
}, c); // string | undefined (Error)
var d1 = swcHelpers.objectSpread({
    a: 123
}, d); // string | number | undefined
var a2 = swcHelpers.objectSpread({
    a: 123
}, t ? a : {}); // string | number
var b2 = swcHelpers.objectSpread({
    a: 123
}, t ? b : {}); // string | number
var c2 = swcHelpers.objectSpread({
    a: 123
}, t ? c : {}); // string | number | undefined
var d2 = swcHelpers.objectSpread({
    a: 123
}, t ? d : {}); // string | number | undefined
