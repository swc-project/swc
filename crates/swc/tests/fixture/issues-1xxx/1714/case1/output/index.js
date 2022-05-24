"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _exportNames = {
    render: true
};
Object.defineProperty(exports, "render", {
    enumerable: true,
    get: function() {
        return _customRender.customRender;
    }
});
var _exportNames = {
    render: true
};
var _interop_require_wildcard = require("@swc/helpers/lib/_interop_require_wildcard.js").default;
var swcHelpers = require("@swc/helpers");
var _customRender = require("./customRender");
var _react = _interop_require_wildcard(require("@testing-library/react"));
// re-export everything
Object.keys(_react).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _react[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _react[key];
        }
    });
});
