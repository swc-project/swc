import * as swcHelpers from "@swc/helpers";
require("react");
let obj = {
    yy: 10,
    yy1: "hello"
}, obj1 = {
    yy: !0
}, defaultObj;
OneThing, OneThing, swcHelpers.extends({}, obj), OneThing, swcHelpers.extends({}, {}), OneThing, swcHelpers.extends({}, obj1, obj), OneThing, swcHelpers.extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
}), OneThing, swcHelpers.extends({}, obj1, {
    yy: 10000,
    yy1: "true"
}), OneThing, swcHelpers.extends({}, defaultObj, {
    yy: !0
}, obj), OneThing, OneThing, swcHelpers.extends({}, {
    "ignore-prop": 200
}), OneThing, swcHelpers.extends({}, {
    yy: 500,
    "ignore-prop": "hello"
}, {
    yy1: "boo"
});
