import * as swcHelpers from "@swc/helpers";
swcHelpers.objectSpread({
    a: 123
}, a), swcHelpers.objectSpread({
    a: 123
}, b), swcHelpers.objectSpread({
    a: 123
}, c), swcHelpers.objectSpread({
    a: 123
}, d), swcHelpers.objectSpread({
    a: 123
}, t ? a : {}), swcHelpers.objectSpread({
    a: 123
}, t ? b : {}), swcHelpers.objectSpread({
    a: 123
}, t ? c : {}), swcHelpers.objectSpread({
    a: 123
}, t ? d : {});
