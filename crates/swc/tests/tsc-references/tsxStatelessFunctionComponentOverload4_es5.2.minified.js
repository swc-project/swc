import * as swcHelpers from "@swc/helpers";
require("react");
var obj2, obj = {
    yy: 10,
    yy1: "hello"
};
swcHelpers.extends({}, obj, {
    yy1: !0
}), swcHelpers.extends({}, obj, {
    extra: "extra attr"
}), swcHelpers.extends({}, obj, {
    y1: 10000
}), swcHelpers.extends({}, obj, {
    yy: !0
}), swcHelpers.extends({}, obj2, {
    extra: "extra attr"
}), swcHelpers.extends({}, obj2, {
    yy: !0
});
