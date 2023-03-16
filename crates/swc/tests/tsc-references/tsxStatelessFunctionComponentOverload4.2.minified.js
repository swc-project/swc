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
    var obj2, obj = {
        yy: 10,
        yy1: "hello"
    };
    OneThing, OneThing, OneThing, _objectSpreadProps(_objectSpread({}, obj), {
        yy1: !0
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj), {
        extra: "extra attr"
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj), {
        y1: 10000
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj), {
        yy: !0
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj2), {
        extra: "extra attr"
    }), OneThing, _objectSpreadProps(_objectSpread({}, obj2), {
        yy: !0
    }), TestingOneThing, TestingOneThing, TestingOptional, TestingOptional, TestingOptional, TestingOptional;
});
