import _extends from "@swc/helpers/src/_extends.mjs";
require("react");
var defaultObj, obj = {
    yy: 10,
    yy1: "hello"
}, obj1 = {
    yy: !0
};
_extends({}, obj), _extends({}, {}), _extends({}, obj1, obj), _extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
}), _extends({}, obj1, {
    yy: 10000,
    yy1: "true"
}), _extends({}, defaultObj, {
    yy: !0
}, obj), _extends({}, {
    "ignore-prop": 200
}), _extends({}, {
    yy: 500,
    "ignore-prop": "hello"
}, {
    yy1: "boo"
});
