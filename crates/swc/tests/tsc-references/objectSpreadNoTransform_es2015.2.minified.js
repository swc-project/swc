var b, _o;
import * as swcHelpers from "@swc/helpers";
const o = swcHelpers.objectSpread({
    x: 1
}, {
    a: "yes",
    b: "no"
});
_o = o, swcHelpers.objectWithoutProperties(_o, [
    "b"
]), { b  } = _o;
