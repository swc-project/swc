"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _foo = /*#__PURE__*/ _interopRequireDefault(require("foo"));
async function foo() {
    await import("foo");
    callback(()=>import("foo"));
}
import("side-effect");
await import("awaited");
