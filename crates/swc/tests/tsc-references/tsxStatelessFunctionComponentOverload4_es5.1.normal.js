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
// @filename: file.tsx
// @jsx: preserve
// @module: amd
// @noLib: true
// @skipLibCheck: true
// @libFiles: react.d.ts,lib.d.ts
var React = require('react');
var obj = {
    yy: 10,
    yy1: "hello"
};
var obj2;
// Error
var c0 = /*#__PURE__*/ React.createElement(OneThing, {
    extraProp: true
}); // extra property;
var c1 = /*#__PURE__*/ React.createElement(OneThing, {
    yy: 10
}); // missing property;
var c2 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    yy1: true
})); // type incompatible;
var c3 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    extra: "extra attr"
})); //  This is OK because all attribute are spread
var c4 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    y1: 10000
})); // extra property;
var c5 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj, {
    yy: true
})); // type incompatible;
var c6 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    extra: "extra attr"
})); // Should error as there is extra attribute that doesn't match any. Current it is not
var c7 = /*#__PURE__*/ React.createElement(OneThing, _extends({}, obj2, {
    yy: true
})); // Should error as there is extra attribute that doesn't match any. Current it is not
// Error
var d1 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    "extra-data": true
});
var d2 = /*#__PURE__*/ React.createElement(TestingOneThing, {
    yy: "hello",
    direction: "left"
});
// Error
var e1 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: true,
    y3: "hello"
});
var e2 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    y3: true
});
var e3 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000,
    children: "hi"
});
var e4 = /*#__PURE__*/ React.createElement(TestingOptional, {
    y1: "hello",
    y2: 1000
}, "Hi");
export { };
