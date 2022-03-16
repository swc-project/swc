import * as swcHelpers from "@swc/helpers";
const extra1 = {
    a: "a",
    b: "b",
    extra: "extra"
};
const a1 = swcHelpers.objectSpread({}, extra1); // spread should not give excess property errors
