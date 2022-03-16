import * as swcHelpers from "@swc/helpers";
var unused1 = swcHelpers.objectSpread({
    b: 1
}, ab);
var unused2 = swcHelpers.objectSpread({}, ab, ab);
var unused3 = swcHelpers.objectSpread({
    b: 1
}, abq);
function g(obj) {
    return swcHelpers.objectSpread({
        x: 1
    }, obj);
}
function h(obj) {
    return swcHelpers.objectSpread({
        x: 1
    }, obj);
}
