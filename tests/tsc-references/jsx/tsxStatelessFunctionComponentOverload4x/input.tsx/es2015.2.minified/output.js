function _extends() {
    return (_extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
        }
        return target;
    }).apply(this, arguments);
}
const React = require("react");
let obj = {
    yy: 10,
    yy1: "hello"
}, obj2;
React.createElement(OneThing, {
    extraProp: !0
}), React.createElement(OneThing, {
    yy: 10
}), React.createElement(OneThing, _extends({
}, obj, {
    yy1: !0
})), React.createElement(OneThing, _extends({
}, obj, {
    extra: "extra attr"
})), React.createElement(OneThing, _extends({
}, obj, {
    y1: 10000
})), React.createElement(OneThing, _extends({
}, obj, {
    yy: !0
})), React.createElement(OneThing, _extends({
}, obj2, {
    extra: "extra attr"
})), React.createElement(OneThing, _extends({
}, obj2, {
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
export { };
