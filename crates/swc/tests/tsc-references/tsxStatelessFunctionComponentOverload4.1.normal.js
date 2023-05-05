//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var obj = {
        yy: 10,
        yy1: "hello"
    };
    var obj2;
    // Error
    var c0 = /*#__PURE__*/ _react.createElement(OneThing, {
        extraProp: true
    }); // extra property;
    var c1 = /*#__PURE__*/ _react.createElement(OneThing, {
        yy: 10
    }); // missing property;
    var c2 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj), {
        yy1: true
    })); // type incompatible;
    var c3 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj), {
        extra: "extra attr"
    })); //  This is OK because all attribute are spread
    var c4 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj), {
        y1: 10000
    })); // extra property;
    var c5 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj), {
        yy: true
    })); // type incompatible;
    var c6 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj2), {
        extra: "extra attr"
    })); // Should error as there is extra attribute that doesn't match any. Current it is not
    var c7 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj2), {
        yy: true
    })); // Should error as there is extra attribute that doesn't match any. Current it is not
    // Error
    var d1 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        "extra-data": true
    });
    var d2 = /*#__PURE__*/ _react.createElement(TestingOneThing, {
        yy: "hello",
        direction: "left"
    });
    // Error
    var e1 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: true,
        y3: "hello"
    });
    var e2 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: "hello",
        y2: 1000,
        y3: true
    });
    var e3 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: "hello",
        y2: 1000,
        children: "hi"
    });
    var e4 = /*#__PURE__*/ _react.createElement(TestingOptional, {
        y1: "hello",
        y2: 1000
    }, "Hi");
});
