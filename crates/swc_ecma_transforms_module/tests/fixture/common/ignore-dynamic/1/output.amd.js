define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interopRequireDefault(_foo);
    async function foo() {
        await import("foo");
        callback(()=>import("foo"));
    }
    import("side-effect");
    await import("awaited");
});
