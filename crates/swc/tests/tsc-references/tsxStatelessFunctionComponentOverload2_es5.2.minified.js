import * as swcHelpers from "@swc/helpers";
require("react");
var defaultObj, obj = {
    yy: 10,
    yy1: "hello"
}, obj1 = {
    yy: !0
};
swcHelpers.extends({}, obj), swcHelpers.extends({}, {}), swcHelpers.extends({}, obj1, obj), swcHelpers.extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
}), swcHelpers.extends({}, obj1, {
    yy: 10000,
    yy1: "true"
}), swcHelpers.extends({}, defaultObj, {
    yy: !0
}, obj), swcHelpers.extends({}, {
    "ignore-prop": 200
}), swcHelpers.extends({}, {
    yy: 500,
    "ignore-prop": "hello"
}, {
    yy1: "boo"
});
