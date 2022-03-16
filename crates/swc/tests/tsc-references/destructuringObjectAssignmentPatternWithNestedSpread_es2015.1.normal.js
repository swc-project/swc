import * as swcHelpers from "@swc/helpers";
// @target: es5, es2015, es2018
// @noTypesAndSymbols: true
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var _c;
_c = c, b = swcHelpers.objectWithoutProperties(_c.x, [
    "a"
]), ({ x: { a  } = d  } = _c), _c;
