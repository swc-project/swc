import * as swcHelpers from "@swc/helpers";
var defaultObj, React = require("react"), obj = {
    yy: 10,
    yy1: "hello"
}, obj1 = {
    yy: !0
};
React.createElement(OneThing, null), React.createElement(OneThing, swcHelpers.extends({}, obj)), React.createElement(OneThing, swcHelpers.extends({}, {})), React.createElement(OneThing, swcHelpers.extends({}, obj1, obj)), React.createElement(OneThing, swcHelpers.extends({}, obj1, {
    yy: 42
}, {
    yy1: "hi"
})), React.createElement(OneThing, swcHelpers.extends({}, obj1, {
    yy: 10000,
    yy1: "true"
})), React.createElement(OneThing, swcHelpers.extends({}, defaultObj, {
    yy: !0
}, obj)), React.createElement(OneThing, {
    "ignore-prop": 100
}), React.createElement(OneThing, swcHelpers.extends({}, {
    "ignore-prop": 200
})), React.createElement(OneThing, swcHelpers.extends({}, {
    yy: 500,
    "ignore-prop": "hello"
}, {
    yy1: "boo"
}));
