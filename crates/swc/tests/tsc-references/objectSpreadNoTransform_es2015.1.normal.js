import * as swcHelpers from "@swc/helpers";
// @target: esnext
const y = {
    a: 'yes',
    b: 'no'
};
const o = swcHelpers.objectSpread({
    x: 1
}, y);
var b;
var rest;
var _o;
_o = o, rest = swcHelpers.objectWithoutProperties(_o, [
    "b"
]), ({ b  } = _o), _o;
