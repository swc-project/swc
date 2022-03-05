import * as swcHelpers from "@swc/helpers";
var extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
};
var a1 = swcHelpers.objectSpread({}, extra1); // spread should not give excess property errors
