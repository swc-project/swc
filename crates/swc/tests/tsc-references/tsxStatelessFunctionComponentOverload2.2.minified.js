//// [file.tsx]
define([
    "require",
    "exports",
    "@swc/helpers/src/_extends.mjs",
    "react"
], function(require, exports, _extends, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), _extends = _extends.default;
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    OneThing, OneThing, _extends({}, obj), OneThing, _extends({}, {}), OneThing, _extends({}, obj1, obj), OneThing, _extends({}, obj1, {
        yy: 42
    }, {
        yy1: "hi"
    }), OneThing, _extends({}, obj1, {
        yy: 10000,
        yy1: "true"
    }), OneThing, _extends({}, defaultObj, {
        yy: !0
    }, obj), OneThing, OneThing, _extends({}, {
        "ignore-prop": 200
    }), OneThing, _extends({}, {
        yy: 500,
        "ignore-prop": "hello"
    }, {
        yy1: "boo"
    });
});
