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
    });
    var defaultObj, obj = {
        yy: 10,
        yy1: "hello"
    }, obj1 = {
        yy: !0
    };
    (_extends = _extends.default)({}, obj), _extends({}, {}), _extends({}, obj1, obj), _extends({}, obj1, {
        yy: 42
    }, {
        yy1: "hi"
    }), _extends({}, obj1, {
        yy: 10000,
        yy1: "true"
    }), _extends({}, defaultObj, {
        yy: !0
    }, obj), _extends({}, {
        "ignore-prop": 200
    }), _extends({}, {
        yy: 500,
        "ignore-prop": "hello"
    }, {
        yy1: "boo"
    });
});
