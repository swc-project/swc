function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
let obj2;
// OK
const two1 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, null);
const two2 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, {
    yy: 100,
    yy1: "hello"
});
const two3 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({
}, obj2)); // it is just any so we allow it to pass through
const two4 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({
    yy: 1000
}, obj2)); // it is just any so we allow it to pass through
const two5 = /*#__PURE__*/ React.createElement(ZeroThingOrTwoThing, _extends({
}, obj2, {
    yy: 1000
})); // it is just any so we allow it to pass through
// OK
const three1 = /*#__PURE__*/ React.createElement(ThreeThing, {
    yy: 99,
    yy1: "hello world"
});
const three2 = /*#__PURE__*/ React.createElement(ThreeThing, {
    y2: "Bye"
});
const three3 = /*#__PURE__*/ React.createElement(ThreeThing, _extends({
}, obj2, {
    y2: 10
})); // it is just any so we allow it to pass through
