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
    var obj2, obj = {
        yy: 10,
        yy1: "hello"
    };
    (_extends = _extends.default)({}, obj, {
        yy1: !0
    }), _extends({}, obj, {
        extra: "extra attr"
    }), _extends({}, obj, {
        y1: 10000
    }), _extends({}, obj, {
        yy: !0
    }), _extends({}, obj2, {
        extra: "extra attr"
    }), _extends({}, obj2, {
        yy: !0
    });
});
