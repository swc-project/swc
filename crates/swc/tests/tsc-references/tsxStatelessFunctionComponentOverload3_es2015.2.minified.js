import * as swcHelpers from "@swc/helpers";
let obj2;
swcHelpers.extends({}, obj2), swcHelpers.extends({
    yy: 1000
}, obj2), swcHelpers.extends({}, obj2, {
    yy: 1000
}), swcHelpers.extends({}, obj2, {
    y2: 10
});
