define([
    "require",
    "exports",
    "react"
], function(require, exports, _react) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "default", {
        get: ()=>_default,
        enumerable: true
    });
    function _exportStar(from, to) {
        Object.keys(from).forEach(function(k) {
            if (k !== "default" && !Object.prototype.hasOwnProperty.call(to, k)) Object.defineProperty(to, k, {
                get: function() {
                    return from[k];
                },
                enumerable: true
            });
        });
        return from;
    }
    _react = _interopRequireDefault(_exportStar(_react, exports));
    var _default = _react.default;
});
