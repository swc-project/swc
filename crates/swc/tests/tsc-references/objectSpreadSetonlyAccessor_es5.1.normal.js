import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: esnext
var o1 = swcHelpers.objectSpread({
    foo: 1
}, {
    set bar (_v){}
});
var o2 = swcHelpers.objectSpread({
    foo: 1
}, {
    set foo (_v){}
});
