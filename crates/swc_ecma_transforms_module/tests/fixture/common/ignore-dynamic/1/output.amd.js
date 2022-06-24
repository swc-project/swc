define([
    "exports",
    "foo"
], function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = _interopRequireDefault(_foo);
    async function foo() {
        await import("foo");
        callback(()=>import("foo"));
    }
    import("side-effect");
    await import("awaited");
});
