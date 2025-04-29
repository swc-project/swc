(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("bar"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "bar"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.bar);
})(this, function(exports, _foo, _bar) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get bar () {
            return _bar.default;
        },
        get default () {
            return _foo.default;
        },
        get foo () {
            return _foo.default;
        }
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _bar = /*#__PURE__*/ _interop_require_default(_bar);
});
