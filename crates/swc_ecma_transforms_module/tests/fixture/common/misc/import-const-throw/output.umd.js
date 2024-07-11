(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports);
    else if (typeof define === "function" && define.amd) define([
        "exports"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {});
})(this, function(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Foo = 42;
    Bar = 43;
    Baz = 44;
    ({ Foo } = {});
    ({ Bar } = {});
    ({ Baz } = {});
    ({ prop: Foo } = {});
    ({ prop: Bar } = {});
    ({ prop: Baz } = {});
});
