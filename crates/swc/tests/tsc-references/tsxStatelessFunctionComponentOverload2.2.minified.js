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
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    OneThing, OneThing, OneThing, OneThing, _object_spread({}, obj1, obj), OneThing, _object_spread_props(_object_spread({}, obj1), {
        yy: 42,
        yy1: "hi"
    }), OneThing, _object_spread_props(_object_spread({}, obj1), {
        yy: 10000,
        yy1: "true"
    }), OneThing, _object_spread(_object_spread_props(_object_spread({}, defaultObj), {
        yy: !0
    }), obj), OneThing, OneThing, OneThing, _object_spread_props(_object_spread({}, {
        yy: 500,
        "ignore-prop": "hello"
    }), {
        yy1: "boo"
    });
});
