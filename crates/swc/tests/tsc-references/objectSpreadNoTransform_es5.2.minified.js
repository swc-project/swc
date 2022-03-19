var _o;
import * as swcHelpers from "@swc/helpers";
_o = swcHelpers.objectSpread({
    x: 1
}, {
    a: 'yes',
    b: 'no'
}), swcHelpers.objectWithoutProperties(_o, [
    "b"
]), _o.b;
