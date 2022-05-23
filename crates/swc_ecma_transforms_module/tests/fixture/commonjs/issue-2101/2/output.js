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
var _customRender = require("./customRender");
var _react = require("@testing-library/react");
// re-ordering the export wildcard from case 1 should make no difference to output
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
