"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return bar;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _ = /*#__PURE__*/ _interop_require_default._(require("."));
function bar() {
    console.log(_.default);
}
