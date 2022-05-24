"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {};
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var _foo = _interop_require_wildcard(require("./foo"));
Object.keys(_foo).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _foo[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _foo[key];
        }
    });
});
var _bar = _interop_require_wildcard(require("./bar"));
Object.keys(_bar).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _bar[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _bar[key];
        }
    });
});
