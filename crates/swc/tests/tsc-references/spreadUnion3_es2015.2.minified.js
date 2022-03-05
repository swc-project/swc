var x;
import * as swcHelpers from "@swc/helpers";
function g(t) {
    swcHelpers.objectSpread({}, t).a;
}
x = void 0, swcHelpers.objectSpread({
    y: 123
}, x), g(), g(void 0), g(null), swcHelpers.objectSpread({}, nullAndUndefinedUnion, nullAndUndefinedUnion), swcHelpers.objectSpread({}, nullAndUndefinedUnion);
