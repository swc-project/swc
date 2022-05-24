import _object_without_properties from "@swc/helpers/lib/_object_without_properties.js";
// @target: es5, es2015, es2018
// @noTypesAndSymbols: true
let a, b, c = {
    x: {
        a: 1,
        y: 2
    }
}, d;
var _c;
_c = c, b = _object_without_properties(_c.x, [
    "a"
]), ({ x: { a  } = d  } = _c), _c;
