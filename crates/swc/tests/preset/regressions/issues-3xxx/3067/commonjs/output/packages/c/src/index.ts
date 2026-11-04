// Simulate accessing a .js file in a third party package that shouldn't be edited
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
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _something = /*#__PURE__*/ _interop_require_default._(require("lodash/dist/something.js"));
function displayC() {
    (0, _something.default)();
    return 'Display C';
}
