(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"), require("bar"), require("baz"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo",
        "bar",
        "baz"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo, global.bar, global.baz);
})(this, function(exports, _foo, _bar, _baz) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    _foo = /*#__PURE__*/ _interop_require_default(_foo);
    _bar = /*#__PURE__*/ _interop_require_wildcard(_bar);
    Foo = 42;
    Bar = 43;
    Baz = 44;
    ({ Foo  } = {});
    ({ Bar  } = {});
    ({ Baz  } = {});
    ({ prop: Foo  } = {});
    ({ prop: Bar  } = {});
    ({ prop: Baz  } = {});
});
