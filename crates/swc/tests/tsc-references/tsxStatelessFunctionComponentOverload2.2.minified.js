//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/_/_object_spread",
    "@swc/helpers/_/_object_spread_props",
    "react"
], function(require, exports, _object_spread, _object_spread_props, _react) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    OneThing, OneThing, OneThing, OneThing, _object_spread._({}, obj1, obj), OneThing, _object_spread_props._(_object_spread._({}, obj1), {
        yy: 42,
        yy1: "hi"
    }), OneThing, _object_spread_props._(_object_spread._({}, obj1), {
        yy: 10000,
        yy1: "true"
    }), OneThing, _object_spread._(_object_spread_props._(_object_spread._({}, defaultObj), {
        yy: !0
    }), obj), OneThing, OneThing, OneThing, _object_spread_props._(_object_spread._({}, {
        yy: 500,
        "ignore-prop": "hello"
    }), {
        yy1: "boo"
    });
});
