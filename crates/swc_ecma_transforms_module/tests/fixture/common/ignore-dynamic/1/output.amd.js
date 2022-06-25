define([
    "require",
    "foo"
], function(require, _foo) {
    "use strict";
    _foo = _interopRequireDefault(_foo);
    async function foo() {
        await import("foo");
        callback(()=>import("foo"));
    }
    import("side-effect");
    await import("awaited");
});
