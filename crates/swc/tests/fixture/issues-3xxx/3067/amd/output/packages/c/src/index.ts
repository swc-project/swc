// Simulate accessing a .js file in a third party package that shouldn't be edited
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_default",
    "lodash/dist/something.js"
], function(require, exports, _interop_require_default, _something) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "displayC", {
        enumerable: true,
        get: function() {
            return displayC;
        }
    });
    _something = /*#__PURE__*/ _interop_require_default._(_something);
    function displayC() {
        (0, _something.default)();
        return 'Display C';
    }
});
