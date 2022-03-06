import * as swcHelpers from "@swc/helpers";
var obj2, React = require("react"), obj = {
    yy: 10,
    yy1: "hello"
};
React.createElement(OneThing, {
    extraProp: !0
}), React.createElement(OneThing, {
    yy: 10
}), React.createElement(OneThing, swcHelpers.extends({}, obj, {
    yy1: !0
})), React.createElement(OneThing, swcHelpers.extends({}, obj, {
    extra: "extra attr"
})), React.createElement(OneThing, swcHelpers.extends({}, obj, {
    y1: 10000
})), React.createElement(OneThing, swcHelpers.extends({}, obj, {
    yy: !0
})), React.createElement(OneThing, swcHelpers.extends({}, obj2, {
    extra: "extra attr"
})), React.createElement(OneThing, swcHelpers.extends({}, obj2, {
    yy: !0
})), React.createElement(TestingOneThing, {
    "extra-data": !0
}), React.createElement(TestingOneThing, {
    yy: "hello",
    direction: "left"
}), React.createElement(TestingOptional, {
    y1: !0,
    y3: "hello"
}), React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    y3: !0
}), React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    children: "hi"
}), React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000
}, "Hi");
