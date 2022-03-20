"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {};
var swcHelpers = require("@swc/helpers");
var _createColors = swcHelpers.interopRequireWildcard(require("./createColors"));
Object.keys(_createColors).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _createColors[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _createColors[key];
        }
    });
});
var _createColorsFromMap = swcHelpers.interopRequireWildcard(require("./createColorsFromMap"));
Object.keys(_createColorsFromMap).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _createColorsFromMap[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _createColorsFromMap[key];
        }
    });
});
var _interfaces = swcHelpers.interopRequireWildcard(require("./interfaces"));
Object.keys(_interfaces).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _interfaces[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _interfaces[key];
        }
    });
});
var _rgbHex = swcHelpers.interopRequireWildcard(require("./rgbHex"));
Object.keys(_rgbHex).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _rgbHex[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _rgbHex[key];
        }
    });
});
var _rgbaString = swcHelpers.interopRequireWildcard(require("./rgbaString"));
Object.keys(_rgbaString).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _rgbaString[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _rgbaString[key];
        }
    });
});
