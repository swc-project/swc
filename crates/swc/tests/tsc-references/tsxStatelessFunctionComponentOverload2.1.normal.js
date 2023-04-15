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
    var obj1 = {
        yy: true
    };
    var obj2 = {
        yy: 500,
        "ignore-prop": "hello"
    };
    var defaultObj;
    // OK
    var c1 = /*#__PURE__*/ _react.createElement(OneThing, null);
    var c2 = /*#__PURE__*/ _react.createElement(OneThing, obj);
    var c3 = /*#__PURE__*/ _react.createElement(OneThing, {});
    var c4 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread._({}, obj1, obj));
    var c5 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj1), {
        yy: 42,
        yy1: "hi"
    }));
    var c6 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj1), {
        yy: 10000,
        yy1: "true"
    }));
    var c7 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread._(_object_spread_props._(_object_spread._({}, defaultObj), {
        yy: true
    }), obj)); // No error. should pick second overload
    var c8 = /*#__PURE__*/ _react.createElement(OneThing, {
        "ignore-prop": 100
    });
    var c9 = /*#__PURE__*/ _react.createElement(OneThing, {
        "ignore-prop": 200
    });
    var c10 = /*#__PURE__*/ _react.createElement(OneThing, _object_spread_props._(_object_spread._({}, obj2), {
        yy1: "boo"
    }));
});
