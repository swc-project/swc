import * as swcHelpers from "@swc/helpers";
// @target: esnext
var y = {
    a: 'yes',
    b: 'no'
};
var o = swcHelpers.objectSpread({
    x: 1
}, y);
var b;
var rest;
var _o;
_o = o, rest = swcHelpers.objectWithoutProperties(_o, [
    "b"
]), b = _o.b, _o;
