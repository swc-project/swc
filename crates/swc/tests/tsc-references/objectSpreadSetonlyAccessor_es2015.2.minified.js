import * as swcHelpers from "@swc/helpers";
swcHelpers.objectSpread({
    foo: 1
}, {
    set bar (_v){}
}), swcHelpers.objectSpread({
    foo: 1
}, {
    set foo (_v){}
});
