//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_object_spread.mjs",
    "@swc/helpers/src/_object_spread_props.mjs",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _object_spread = _object_spread.default, _object_spread_props = _object_spread_props.default;
    var obj2, obj = {
        yy: 10,
        yy1: "hello"
    };
    OneThing, OneThing, OneThing, _object_spread_props(_object_spread({}, obj), {
        yy1: !0
    }), OneThing, _object_spread_props(_object_spread({}, obj), {
        extra: "extra attr"
    }), OneThing, _object_spread_props(_object_spread({}, obj), {
        y1: 10000
    }), OneThing, _object_spread_props(_object_spread({}, obj), {
        yy: !0
    }), OneThing, _object_spread_props(_object_spread({}, obj2), {
        extra: "extra attr"
    }), OneThing, _object_spread_props(_object_spread({}, obj2), {
        yy: !0
    }), TestingOneThing, TestingOneThing, TestingOptional, TestingOptional, TestingOptional, TestingOptional;
});
