//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _objectSpread, _objectSpreadProps, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _objectSpread = _objectSpread.default, _objectSpreadProps = _objectSpreadProps.default;
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    OneThing, OneThing, OneThing, OneThing, _objectSpread({}, obj1, obj), OneThing, _objectSpreadProps(_objectSpread({}, obj1), {
        yy: 42,
        yy1: "hi"
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj1), {
        yy: 10000,
        yy1: "true"
    }), OneThing, _objectSpread(_objectSpreadProps(_objectSpread({}, defaultObj), {
        yy: !0
    }), obj), OneThing, OneThing, OneThing, _objectSpreadProps(_objectSpread({}, {
        yy: 500,
        "ignore-prop": "hello"
    }), {
        yy1: "boo"
    });
});
