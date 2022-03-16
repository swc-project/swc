import * as swcHelpers from "@swc/helpers";
// @strict: true
// @target: esnext
const o1 = swcHelpers.objectSpread({
    foo: 1
}, {
    set bar (_v){}
});
const o2 = swcHelpers.objectSpread({
    foo: 1
}, {
    set foo (_v){}
});
