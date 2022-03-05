import * as swcHelpers from "@swc/helpers";
// @target: es5, es2015, es2018
// @noTypesAndSymbols: true
var a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var _c;
var ref, ref1;
_c = c, b = swcHelpers.objectWithoutProperties(_c.x, [
    "a"
]), ref = _c, ref1 = ref.x, a = (ref1 === void 0 ? d : ref1).a, ref, _c;
