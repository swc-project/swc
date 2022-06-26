import _extends from "@swc/helpers/src/_extends.mjs";
var obj2;
// OK
var two1 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, null);
var two2 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, {
    yy: 100,
    yy1: "hello"
});
var two3 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({}, obj2)); // it is just any so we allow it to pass through
var two4 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({
    yy: 1000
}, obj2)); // it is just any so we allow it to pass through
var two5 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({}, obj2, {
    yy: 1000
})); // it is just any so we allow it to pass through
// OK
var three1 = /*#__PURE__*/ React.createElement(ThreeThing, {
    yy: 99,
    yy1: "hello world"
});
var three2 = /*#__PURE__*/ React.createElement(ThreeThing, {
    y2: "Bye"
});
var three3 = /*#__PURE__*/ React.createElement(ThreeThing, _extends({}, obj2, {
    y2: 10
})); // it is just any so we allow it to pass through
